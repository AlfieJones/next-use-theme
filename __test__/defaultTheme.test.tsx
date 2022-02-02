import { render, screen } from "@testing-library/react";
import React from "react";
import { localStorageMock } from "./__mocks__";
import { Basic } from "./components";
import { ThemeProvider } from "../src";

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

    expect(screen.getByTestId("trueTheme").textContent).toBe("system");
  });

  test("Should return light when light is set as default-theme without mediaQuery", () => {
    render(
      <ThemeProvider defaultTheme="light" mediaQuery={false}>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  test("Should return dark when dark is set as default-theme without mediaQuery", () => {
    render(
      <ThemeProvider defaultTheme="dark" mediaQuery={false}>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("trueTheme").textContent).toBe("dark");
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

    expect(screen.getByTestId("trueTheme").textContent).toBe("tech");
  });

  test("Should throw error when tech is set as default-theme with no themes set without mediaQuery", () => {
    let error;
    jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    try {
      render(
        <ThemeProvider defaultTheme="tech" mediaQuery={false}>
          <Basic />
        </ThemeProvider>
      );
    } catch (e) {
      error = e.message;
    }

    jest.restoreAllMocks();

    expect(error).toEqual(
      "Unknown theme: tech. Have you included it in the themes prop?"
    );
  });
});
