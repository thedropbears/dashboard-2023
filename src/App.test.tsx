import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { act } from "react-dom/test-utils";

test("Renders", () => {
  render(<App />);
  const linkElement = screen.getAllByText(/None/i);
  expect(linkElement[0]).toBeInTheDocument();
});

test("Clicking on an option changes the displayed piece", () => {
  // const { container } = render(<App />);
  render(<App />);

  const radio = screen.getAllByRole("radio");

  console.log(radio);

  act(() => {
    radio[0].click();
  });
  let pieceDisplay = screen.getByRole("none");
  let style = getComputedStyle(pieceDisplay).backgroundColor;

  expect(style).toEqual("yellow");

  act(() => {
    radio[1].click();
  });
  pieceDisplay = screen.getByRole("none");
  style = getComputedStyle(pieceDisplay).backgroundColor;
  expect(style).toEqual("violet");

  act(() => {
    radio[2].click();
  });
  pieceDisplay = screen.getByRole("none");
  style = getComputedStyle(pieceDisplay).backgroundColor;
  expect(style).toEqual("grey");
});

test("Clicking on a node should change it", () => {
  render(<App />);

  const table = screen.getAllByRole("button");

  for (let i = 0; i < table.length; i++) {
    const item = table[i];

    let style = getComputedStyle(item).backgroundColor;

    expect(style).toEqual("red");

    act(() => {
      item.click();
    });

    style = getComputedStyle(item).backgroundColor;

    expect(style).toEqual("green");
  }
});
