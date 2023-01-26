import React, { useState } from "react";
import "./App.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { NetworkTables, NetworkTableTypeInfos } from 'ntcore-ts-client';

type cubeOrCone = "Cube" | "Cone" | "None";

function useNTInstance(portOrURI: number | string) {
  return (typeof portOrURI === "number") ? NetworkTables.createInstanceByTeam(4774, portOrURI) : NetworkTables.createInstanceByURI(portOrURI);
}

function ConeOrCube(...props: any): JSX.Element {
  const piece: cubeOrCone = props[0].piece;

  return (
    <div
      className="coneOrCube"
      style={{
        backgroundColor:
          piece === "None" ? "grey" : piece === "Cube" ? "violet" : "yellow",
      }}
    >
      <p className="text">{piece}</p>
    </div>
  );
}

function Table(...props: any) {
  const table: boolean[][] = props[0].table;
  const setTable: any = props[0].setTable;

  function handleButtonClick(column: number, row: number) {
    const tableClone = [...table];
    tableClone[row][column] = !tableClone[row][column];
    setTable(tableClone);
  }

  return (
    <table className="table">
      {[0, 1, 2].map(function (key, row) {
        return (
          <tr key={key}>
            {table[row].map(function (item, key) {
              return (
                <td key={key}>
                  <p style={{ fontSize: '12px' }}>Node ID #{row * 9 + key}</p>
                  <Button
                    onClick={() => {
                      handleButtonClick(key, row);
                    }}
                    variant="contained"
                    className="gridButton"
                    style={{
                      backgroundColor: item ? "green" : "red"  
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
    </table>
  );
}

function splitArray(array: any[], times: number) {

  const result = array.reduce((resultArray, item, index) => { 
    const chunkIndex = Math.floor(index/times)

    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

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
  const pickupTopic = instance.createTopic<number>('PickupObject', NetworkTableTypeInfos.kInteger, 0);
  const  nodesTopic = instance.createTopic<boolean[]>('NodeObject', NetworkTableTypeInfos.kBooleanArray, Array(27).fill(false));

  function handleCheck(e: any) {
    setPiece(e.target.value);
  }

  pickupTopic.subscribe((value: number | null) => {
    const toType: cubeOrCone = ({
      0: "None",
      1: "Cone",
      2: "Cube"
    } as { [key: number]: cubeOrCone })[value || 0]

    // Don't update the DOM if the value hasn't changed
    if (toType !== piece) {
      setPiece(toType);
    }
  }, false);

  nodesTopic.subscribe((value: boolean[] | null) => {
    const splitted = splitArray((value || []), 9);
    if (splitted !== table) { 
      setPiece(splitted);
    }
  }, false);

  return (
    <div className="App">
      <h1 id="title">Charged Up Dashboard ⚡</h1>
      <Stack direction="row" spacing={2}>
        <div>
          <ConeOrCube piece={piece} />
          <form onSubmit={handleCheck}>
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
        <Table table={table} setTable={setTable}/>
      </Stack>
    </div>
  );
}

export default App;
