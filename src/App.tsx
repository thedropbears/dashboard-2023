import React, { useState } from "react";
import "./App.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

type cubeOrCone = "cube" | "cone" | "none";

function ConeOrCube(...props: any): JSX.Element {
  const piece: cubeOrCone = props[0].piece;

  // [{ piece: value }]

  return (
    <div
      className="coneOrCube"
      style={{
        // backgroundColor: piece === "cube" ? "violet" : "yellow",
        backgroundColor:
          piece === "none" ? "grey" : piece === "cube" ? "violet" : "yellow",
      }}
    >
      <p className="text">{piece}</p>
    </div>
  );
}

function Table() {
  const [table, setTable] = useState<boolean[][]>([
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
  ]);

  function handleButtonClick(column: number, row: number) {
    const tableClone = [...table];
    tableClone[row][column] = !tableClone[row][column];
    setTable(tableClone);
  }

  return (
    <table className="table">
      <tr>
        {table[0].map(function (item, key) {
          return (
            <td>
              <Button
                onClick={() => {
                  handleButtonClick(key, 0);
                }}
                variant="contained"
              >
                {item ? "o" : "x"}
              </Button>
            </td>
          );
        })}
      </tr>
      <tr>
        {table[1].map(function (item, key) {
          return (
            <td>
              <Button
                onClick={() => {
                  handleButtonClick(key, 1);
                }}
                variant="contained"
              >
                {item ? "o" : "x"}
              </Button>
            </td>
          );
        })}
      </tr>
      <tr>
        {table[2].map(function (item, key) {
          return (
            <td>
              <Button
                onClick={() => {
                  handleButtonClick(key, 2);
                }}
                variant="contained"
              >
                {item ? "o" : "x"}
              </Button>
            </td>
          );
        })}
      </tr>
    </table>
  );
}

function App() {
  const [piece, setPiece] = useState<cubeOrCone>("none");

  function handleCheck(e: any) {
    setPiece(e.target.value);
  }

  return (
    <div className="App">
      <h1 id="title">Charged Up Dashboard ⚡</h1>
      <Stack direction="row" spacing={2}>
        <div>
          <ConeOrCube piece={piece} />
          <form onSubmit={handleCheck}>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="cone"
                  checked={piece === "cone"}
                  onChange={handleCheck}
                />
                Cone
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="cube"
                  checked={piece === "cube"}
                  onChange={handleCheck}
                />
                Cube
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="none"
                  checked={piece === "none"}
                  onChange={handleCheck}
                />
                None
              </label>
            </div>
          </form>
        </div>
        <Table />
      </Stack>
    </div>
  );
}

export default App;
