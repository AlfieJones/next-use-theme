import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider, sessionStorage } from "../src";
import { sessionStorageMock, systemMediaMock } from "./__mocks__";
import { Basic, ChangeTheme } from "./components";

describe("LocalStorage test-suite", () => {
  beforeAll(() => {
    systemMediaMock();
    sessionStorageMock();
  });

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  test("Tests session storage works with key", () => {
    render(
      <ThemeProvider
        themes={["tech", "dark", "light"]}
        storageHandlers={[sessionStorage({ key: "test" })]}
      >
        <ChangeTheme newTheme="tech" />
      </ThemeProvider>
    );

    expect(screen.getByTestId("changeTheme-newTheme").textContent).toBe("tech");
    expect(screen.getByTestId("changeTheme-theme").textContent).toBe("tech");

    render(
      <ThemeProvider
        themes={["tech", "dark", "light"]}
        storageHandlers={[sessionStorage({ key: "test" })]}
      >
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-theme").textContent).toBe("tech");
    expect(screen.getByTestId("basic-trueTheme").textContent).toBe("tech");
  });

  test("Checking tech theme is stored into local storage and read", () => {
    render(
      <ThemeProvider themes={["tech"]} storageHandlers={[sessionStorage()]}>
        <ChangeTheme newTheme="tech" />
      </ThemeProvider>
    );

    expect(screen.getByTestId("changeTheme-newTheme").textContent).toBe("tech");
    expect(screen.getByTestId("changeTheme-theme").textContent).toBe("tech");

    render(
      <ThemeProvider themes={["tech"]} storageHandlers={[sessionStorage()]}>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-theme").textContent).toBe("tech");
    expect(screen.getByTestId("basic-trueTheme").textContent).toBe("tech");
  });

  test("Checking only listed themes are read", () => {
    render(
      <ThemeProvider themes={["tech"]} storageHandlers={[sessionStorage()]}>
        <ChangeTheme newTheme="tech" />
      </ThemeProvider>
    );

    expect(screen.getByTestId("changeTheme-newTheme").textContent).toBe("tech");
    expect(screen.getByTestId("changeTheme-theme").textContent).toBe("tech");

    render(
      <ThemeProvider storageHandlers={[sessionStorage()]}>
        <Basic />
      </ThemeProvider>
    );

    expect(screen.getByTestId("basic-theme").textContent).toBe("light");
    expect(screen.getByTestId("basic-trueTheme").textContent).toBe("system");
  });
});
