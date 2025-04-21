import App from "../src/App";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import { Task } from "../../shared/types";

jest.mock("axios");

describe("App", () => {
  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("Welcome")).toBeInTheDocument(); // Update the text based on what you expect in App.js
  });
});
