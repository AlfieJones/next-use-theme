import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "../src";
import { localStorageMock } from "./__mocks__";
import { Basic, ChangeTheme } from "./components";

describe("LocalStorage test-suite", () => {
  beforeAll(() => {
    // Create a mock of the window.matchMedia function
    // Based on: https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    Object.defineProperty(window, "sessionStorage", {
      value: localStorageMock(),
    });
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  test("Should return system when no default-theme is set", () => {
    render(
      <ThemeProvider>
        <ChangeTheme newTheme="dark" />
      </ThemeProvider>
    );

    expect(screen.getByTestId("changeTheme-newTheme").textContent).toBe("dark");
    expect(screen.getByTestId("changeTheme-theme").textContent).toBe("dark");

    render(
      <ThemeProvider>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-theme").textContent).toBe("dark");
    expect(screen.getByTestId("basic-trueTheme").textContent).toBe("dark");
  });

  test("Checking tech theme is stored into local storage and read", () => {
    render(
      <ThemeProvider themes={["tech"]}>
        <ChangeTheme newTheme="tech" />
      </ThemeProvider>
    );

    expect(screen.getByTestId("changeTheme-newTheme").textContent).toBe("tech");
    expect(screen.getByTestId("changeTheme-theme").textContent).toBe("tech");

    render(
      <ThemeProvider themes={["tech"]}>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-theme").textContent).toBe("tech");
    expect(screen.getByTestId("basic-trueTheme").textContent).toBe("tech");
  });

  test("Checking only listed themes are read", () => {
    render(
      <ThemeProvider themes={["tech"]}>
        <ChangeTheme newTheme="tech" />
      </ThemeProvider>
    );

    expect(screen.getByTestId("changeTheme-newTheme").textContent).toBe("tech");
    expect(screen.getByTestId("changeTheme-theme").textContent).toBe("tech");

    render(
      <ThemeProvider>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-theme").textContent).toBe("light");
    expect(screen.getByTestId("basic-trueTheme").textContent).toBe("system");
  });
});
