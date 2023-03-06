import React, { useState, useEffect } from "react";
import "./App.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { NetworkTablesTypeInfos } from "ntcore-ts-client";
import { useNTValue } from "ntcore-react";

type cubeOrCone = "Cube" | "Cone" | "None";

function ConeOrCube(props: { piece: cubeOrCone }): JSX.Element {
  const { piece } = props;

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

function Table(props: {
  table: boolean[][];
  bestNode: number;
}) {
  const { table, bestNode } = props;

  console.log(table)

  return (
    <table className="table">
      {[0, 1, 2].map(function (_key, row) {
        return (
          <tr key={_key}>
            {table[row].map(function (item, key) {
              return (
                <td key={key}>
                  <p style={{ fontSize: "12px" }}>Node ID #{row * 9 + key}</p>
                  <Button
                    variant="contained"
                    className="gridButton"
                    style={{
                      backgroundColor: (row * 3 + key === bestNode) ? "violet" : item ? "red" : "green",
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

function numberToCubeOrCone(x: number): cubeOrCone {
  if (x === 1)
    return "Cone"
  if (x === 2)
    return "Cube"
  return "None"
}

function App() {
  const side = useNTValue<boolean>(
    "/FMSInfo/IsRedAlliance",
    NetworkTablesTypeInfos.kBoolean,
    true
  )

  const sidePath: string = "/components/score_game_piece/state_" + (side ? "red" : "blue")

  const piece = useNTValue<number>(
    "/components/gripper/get_current_piece_as_int",
    NetworkTablesTypeInfos.kInteger,
    0
  )
  const table = useNTValue<boolean[]>(
    sidePath,
    NetworkTablesTypeInfos.kBooleanArray,
    Array(27).fill(false)
  )
  const bestNode = useNTValue<number>(
    "/components/score_game_piece/pick_node_as_int",
    NetworkTablesTypeInfos.kInteger,
    -1
  )

  return (
    <div className="App">
      <h1 id="title">Charged Up Dashboard ⚡ (Side: {side ? "Red" : "Blue"})</h1>
      <Stack direction="row" spacing={2}>
        <div>
          <ConeOrCube piece={numberToCubeOrCone(piece)} />
        </div>
        <Table table={splitArray<boolean>(table, 9)} bestNode={bestNode} />
      </Stack>
    </div>
  );
}

export default App;
