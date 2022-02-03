import { render, screen } from "@testing-library/react";
import React from "react";
import { localStorageMock } from "./__mocks__";
import { Basic } from "./components";
import { ThemeProvider } from "../src";

describe("Default theme test-suite", () => {
  beforeAll(() => {
    localStorageMock();
  });

  beforeEach(() => {
    // Create mocks of localStorage getItem and setItem functions
    window.localStorage.clear();
  });

  test("Should return system when no default-theme is set", () => {
    render(
      <ThemeProvider>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-trueTheme").textContent).toBe("system");
  });

  test("Should return light when light is set as default-theme without mediaQuery", () => {
    render(
      <ThemeProvider defaultTheme="light" mediaQuery={false}>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-theme").textContent).toBe("light");
  });

  test("Should return dark when dark is set as default-theme without mediaQuery", () => {
    render(
      <ThemeProvider defaultTheme="dark" mediaQuery={false}>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-trueTheme").textContent).toBe("dark");
  });

  test("Should return tech when tech is set as default-theme with themes set to ['light', 'dark', 'tech'] without mediaQuery", () => {
    render(
      <ThemeProvider
        defaultTheme="tech"
        themes={["light", "dark", "tech"]}
        mediaQuery={false}
      >
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-trueTheme").textContent).toBe("tech");
  });

  test("Should throw error when tech is set as default-theme with no themes set without mediaQuery", () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();

    render(
      <ThemeProvider defaultTheme="tech">
        <Basic />
      </ThemeProvider>
    );

    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Unknown theme: tech. Have you included it in the themes prop?"
    );
  });
});
