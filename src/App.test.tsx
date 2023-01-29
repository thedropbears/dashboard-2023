import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import Button from "@mui/material/Button";
import { act } from "react-dom/test-utils";

test("Renders", () => {
  render(<App />);
  const linkElement = screen.getAllByText(/None/i);
  expect(linkElement[0]).toBeInTheDocument();
});

test("Clicking on an option changes the displayed piece", () => {
  const { container } = render(<App />);

  const radio = container.getElementsByTagName("label");
  act(() => {
    radio[0].click();
  });
  let pieceDisplay = container.getElementsByClassName("coneOrCube")[0];
  let style = getComputedStyle(pieceDisplay).backgroundColor;

  expect(style).toEqual("yellow");

  act(() => {
    radio[1].click();
  });
  pieceDisplay = container.getElementsByClassName("coneOrCube")[0];
  style = getComputedStyle(pieceDisplay).backgroundColor;

  expect(style).toEqual("violet");

  act(() => {
    radio[2].click();
  });
  pieceDisplay = container.getElementsByClassName("coneOrCube")[0];
  style = getComputedStyle(pieceDisplay).backgroundColor;

  expect(style).toEqual("grey");
});

test("Clicking on a node should change it", () => {
  const { container } = render(<App />);

  const table = container.getElementsByTagName("button");

  for (let i = 0; i < table.length; i++) {
    const item = table[i];

    let style = getComputedStyle(item).backgroundColor;

    console.log(item.children[1], item.children.length);

    expect(style).toEqual("red");

    act(() => {
      item.click();
    });

    style = getComputedStyle(item).backgroundColor;

    expect(style).toEqual("green");
  }
});
