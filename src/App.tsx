import React, { useState } from "react";
import "./App.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { NetworkTables, NetworkTableTypeInfos } from "ntcore-ts-client";

type cubeOrCone = "Cube" | "Cone" | "None";

function useNTInstance(portOrURI: number | string) {
  return typeof portOrURI === "number"
    ? NetworkTables.createInstanceByTeam(4774, portOrURI)
    : NetworkTables.createInstanceByURI(portOrURI);
}

function ConeOrCube(props: { piece: cubeOrCone }): JSX.Element {
  const { piece } = props;

  return (
    <div
      className="coneOrCube"
      role="none"
      style={{
        backgroundColor:
          piece === "None" ? "grey" : piece === "Cube" ? "violet" : "yellow",
      }}
    >
      <p className="text">{piece}</p>
    </div>
  );
}

function Table(props: {
  table: boolean[][];
  setTable: (table: boolean[][]) => void;
}) {
  const { table, setTable } = props;

  function handleButtonClick(column: number, row: number) {
    const tableClone = [...table];
    tableClone[row][column] = !tableClone[row][column];
    setTable(tableClone);
  }

  return (
    <table className="table">
      <tbody>
        {[0, 1, 2].map(function (key, row) {
          return (
            <tr key={key}>
              {table[row].map(function (item, key) {
                return (
                  <td key={key}>
                    <p style={{ fontSize: "12px" }}>Node ID #{row * 9 + key}</p>
                    <Button
                      onClick={() => {
                        handleButtonClick(key, row);
                      }}
                      variant="contained"
                      className="gridButton"
                      style={{
                        backgroundColor: item ? "green" : "red",
                      }}
                    >
                      {item ? "o" : "x"}
                    </Button>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function splitArray<T>(array: T[], times: number) {
  const result = array.reduce<T[][]>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / times);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result;
}

function App() {
  const [piece, setPiece] = useState<cubeOrCone>("None");
  const [table, setTable] = useState<boolean[][]>([
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
  ]);

  const instance = useNTInstance(5810);

  /*
    0: none
    1: cone
    2: cube
   */
  const pickupTopic = instance.createTopic<number>(
    "PickupObject",
    NetworkTableTypeInfos.kInteger,
    0
  );
  const nodesTopic = instance.createTopic<boolean[]>(
    "NodeObject",
    NetworkTableTypeInfos.kBooleanArray,
    Array(27).fill(false)
  );

  function handleCheck(
    e: React.ChangeEvent<HTMLInputElement & { value: cubeOrCone }>
  ) {
    setPiece(e.target.value);
  }

  pickupTopic.subscribe((value: number | null) => {
    const toType = (
      {
        0: "None",
        1: "Cone",
        2: "Cube",
      } as const
    )[value || 0];

    // Don't update the DOM if the value hasn't changed
    if (toType && toType !== piece) {
      setPiece(toType);
    }
  }, false);

  nodesTopic.subscribe((value: boolean[] | null) => {
    const splitted = splitArray(value || [], 9);
    if (splitted !== table) {
      setTable(splitted);
    }
  }, false);

  return (
    <div className="App">
      <h1 id="title">Charged Up Dashboard ⚡</h1>
      <Stack direction="row" spacing={2}>
        <div>
          <ConeOrCube piece={piece} />
          <form>
            <Stack direction="row">
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value="Cone"
                    checked={piece === "Cone"}
                    onChange={handleCheck}
                  />
                  Cone
                </label>
              </div>
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value="Cube"
                    checked={piece === "Cube"}
                    onChange={handleCheck}
                  />
                  Cube
                </label>
              </div>
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    value="None"
                    checked={piece === "None"}
                    onChange={handleCheck}
                  />
                  None
                </label>
              </div>
            </Stack>
          </form>
        </div>
        <Table table={table} setTable={setTable} />
      </Stack>
    </div>
  );
}

export default App;
