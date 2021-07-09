import React, { useEffect, FC, useCallback, memo, useState } from "react";
import Head from "next/head";
import Defaults from "./defaults.index";

export type ThemeProviderProps = {
  /** Use media query to toggle the theme between light and dark */
  mediaQuery?: boolean;
  /** Should we set the HTML attribute, defaults to true. If set to false handling the theme change is up to you */
  setAttribute?: boolean;
  /** The HTML attribute to be set. Defaults to class */
  attribute?: `data-${string}` | "class";
  /** List of all available theme names, defaults to the two props [lightTheme, darkTheme], eg ["lightTheme", "darkTheme"] */
  themes?: string[];
  /** Dark theme name, defaults to dark */
  darkTheme?: string;
  /** Light theme name, defaults to light */
  lightTheme?: string;
  /** Key used to store theme setting in localStorage */
  storageKey?: string;
  /** Default theme, defaults to light */
  defaultTheme?: string;
  /** The components children */
  children?: React.ReactNode;
};

// This is the type for our context usage
export type UseThemeContext = {
  /** List of all available theme names, defaults to the two props [lightTheme, darkTheme], eg ["lightTheme", "darkTheme"] */
  themes: string[];
  /** The function to call when we want to change the theme */
  handleChange: (theme: string) => void;
  /** The current theme value */
  value: string;
};

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
  children,
}: ThemeProviderProps) => {
  const [activeTheme, setActiveTheme] = useState<string | undefined>();

  useEffect(() => {
    if (activeTheme !== undefined)
      localStorage.setItem(storageKey, activeTheme);
  }, [activeTheme, storageKey]);

  // Applies the theme to the specified attribute
  const applyAttribute = useCallback(
    (theme: string) => {
      if (setAttribute) {
        const root = document.documentElement;
        if (attribute === "class") {
          root.classList.remove(...themes);
          root.classList.add(theme);
        } else {
          root.setAttribute(attribute, theme);
        }
      }
    },
    [attribute, setAttribute, themes]
  );

  // Handles all our theme changes
  const handleChange = useCallback(
    (theme: string) => {
      if (theme === "system" && mediaQuery) {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? darkTheme
          : lightTheme;
      }
      if (themes.includes(theme)) {
        setActiveTheme(theme);
        applyAttribute(theme);
      } else {
        throw new Error(
          `Unknown theme: ${theme}. Have you included it in the themes prop?`
        );
      }
    },
    [applyAttribute, darkTheme, lightTheme, mediaQuery, themes]
  );

  const handleStorageEvent = useCallback(
    (event: StorageEvent) => {
      if (event.key === storageKey) {
        handleChange(event.newValue || defaultTheme);
      }
    },
    [defaultTheme, handleChange, storageKey]
  );

  useEffect(() => {
    window.addEventListener("storage", handleStorageEvent);
    let theme = localStorage.getItem(storageKey);
    if (theme === "system" || theme === null) {
      if (mediaQuery) {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? darkTheme
          : lightTheme;
      } else {
        theme = defaultTheme;
      }
    }
    setActiveTheme(theme);
    return () => window.removeEventListener("storage", handleStorageEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTheme) handleTheme(activeTheme, themes, attribute);
  }, [activeTheme, themes, attribute]);

  // Listener for system theme changes
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
