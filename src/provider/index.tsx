import React, { useEffect, FC, useCallback, memo, useState } from "react";
import Head from "next/head";
import { ThemeProviderProps, UseThemeContext } from "./index.props";
import Defaults from "./index.defaults";

function handleTheme(theme: string, themes: string[], attribute: string) {
  const root = document.documentElement;

  if (attribute === "class") {
    root.classList.remove(...themes);
    root.classList.add(theme);
  } else {
    root.setAttribute(attribute, theme);
  }
}

export const ThemeContext = React.createContext<UseThemeContext>({
  themes: Defaults.themes,
  value: Defaults.defaultTheme,
  handleChange: () => {},
});

const ThemeScript = memo(
  ({
    storageKey,
    attribute,
    mediaQuery,
    defaultTheme,
    darkTheme,
    lightTheme,
  }: {
    storageKey: string;
    attribute: `data-${string}` | "class";
    mediaQuery: boolean;
    defaultTheme: string;
    darkTheme: string;
    lightTheme: string;
  }) => {
    // My attempt at minimising the script code
    // This code handles the Flash of incorrect theme or (FOIT)
    // THis isn't fun

    const getElement = (() => {
      if (attribute === "class") {
        return `var d=document.documentElement.classList;`;
      }
      return "var d=document.documentElement;";
    })();

    const setAttr = (theme: string) => {
      if (attribute === "class") return `d.add(${theme})`;

      return `d.setAttribute('${attribute}', ${theme})`;
    };

    // TODO come back when NextJS Script component works for our use case
    return (
      <Head>
        {mediaQuery ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `${getElement}!function(){try{var e=localStorage.getItem('${storageKey}');e||(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"${darkTheme}":"${lightTheme}")}catch(e){}e||(e="${defaultTheme}");${setAttr(
                "e"
              )}}();`,
            }}
          />
        ) : (
          <script
            dangerouslySetInnerHTML={{
              __html: `${getElement}!function(){try{var e=localStorage.getItem('${storageKey}');}catch(e){}e||(e="${defaultTheme}");${setAttr(
                "e"
              )}}();`,
            }}
          />
        )}
      </Head>
    );
  }
);

const ThemeProvider: FC<ThemeProviderProps> = ({
  attribute = Defaults.attribute,
  defaultTheme = Defaults.defaultTheme,
  storageKey = Defaults.storageKey,
  darkTheme = Defaults.darkTheme,
  lightTheme = Defaults.lightTheme,
  setAttribute = Defaults.setAttribute,
  mediaQuery = Defaults.mediaQuery,
  themes = [lightTheme, darkTheme],
  onChange,
  children,
}: ThemeProviderProps) => {
  const [activeTheme, setActiveTheme] = useState<string | undefined>();

  useEffect(() => {
    if (activeTheme) localStorage.setItem(storageKey, activeTheme);
  }, [activeTheme, storageKey]);

  useEffect(() => {
    let theme = localStorage.getItem(storageKey);
    if (theme === null) {
      if (mediaQuery) {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? darkTheme
          : lightTheme;
      } else {
        theme = defaultTheme;
      }
    }
    setActiveTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTheme) handleTheme(activeTheme, themes, attribute);
  }, [activeTheme, themes, attribute]);

  const handleChange = useCallback(
    (theme: string) => {
      setActiveTheme(theme);
      if (setAttribute) {
        const root = document.documentElement;
        if (attribute === "class") {
          root.classList.remove(...themes);
          root.classList.add(theme);
        } else {
          root.setAttribute(attribute, theme);
        }
      }
      if (onChange) onChange(theme);
    },
    [attribute, onChange, setActiveTheme, setAttribute, themes]
  );

  const mqlListener = useCallback(
    (e) => {
      handleChange(e.matches ? darkTheme : lightTheme);
    },
    [darkTheme, handleChange, lightTheme]
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    if (mediaQuery) {
      mql.addEventListener("change", mqlListener);
    } else {
      mql.removeEventListener("change", mqlListener);
    }
    return () => mql.removeEventListener("change", mqlListener);
  }, [mediaQuery, mqlListener]);

  const providerValue: UseThemeContext = React.useMemo(
    () => ({
      themes,
      handleChange,
      value: activeTheme || defaultTheme,
    }),
    [activeTheme, defaultTheme, handleChange, themes]
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScript
        attribute={attribute}
        darkTheme={darkTheme}
        defaultTheme={defaultTheme}
        lightTheme={lightTheme}
        mediaQuery={mediaQuery}
        storageKey={storageKey}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
