import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "../src";
import { Basic } from "./components";

describe("Default theme test-suite", () => {
  test("Should return system when no default-theme is set", () => {
    render(
      <ThemeProvider>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("system");
  });

  test("should return light when no default-theme is set and enableSystem=false", () => {
    render(
      <ThemeProvider enableSystem={false}>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  test("should return light when light is set as default-theme", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  test("should return dark when dark is set as default-theme", () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });
});
