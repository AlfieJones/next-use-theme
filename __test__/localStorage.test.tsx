import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider, localStorage } from "../src";
import { systemMediaMock } from "./__mocks__";
import { Basic, ChangeTheme } from "./components";

describe("LocalStorage test-suite", () => {
  beforeAll(() => {
    systemMediaMock();
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  test("Tests session storage works with key", () => {
    render(
      <ThemeProvider
        themes={["tech", "dark", "light"]}
        storageHandlers={[localStorage({ key: "Test" })]}
      >
        <ChangeTheme newTheme="tech" />
      </ThemeProvider>
    );

    expect(screen.getByTestId("changeTheme-newTheme").textContent).toBe("tech");
    expect(screen.getByTestId("changeTheme-theme").textContent).toBe("tech");

    render(
      <ThemeProvider
        themes={["tech", "dark", "light"]}
        storageHandlers={[localStorage({ key: "Test" })]}
      >
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-theme").textContent).toBe("tech");
    expect(screen.getByTestId("basic-trueTheme").textContent).toBe("tech");
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
