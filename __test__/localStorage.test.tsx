import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "../src";
import { localStorageMock } from "./__mocks__";
import { Basic, ChangeTheme } from "./components";

describe("Default theme test-suite", () => {
  beforeAll(() => {
    // Create a mock of the window.matchMedia function
    // Based on: https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock(),
    });
  });

  test("Should return system when no default-theme is set", () => {
    render(
      <ThemeProvider>
        <ChangeTheme newTheme="dark" />
      </ThemeProvider>
    );

    expect(screen.getByTestId("newTheme").textContent).toBe("dark");

    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });
});
