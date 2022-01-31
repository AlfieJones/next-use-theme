import React, { useEffect, FC, useCallback, memo, useState } from "react";
import Head from "next/head";
import { ThemeProviderProps, UseThemeContext } from "./index.props";
import Defaults from "./index.defaults";
import { StorageProviderType } from "./storage/storage.types";

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

const setInject = (providers: StorageProviderType[]): string =>
  `try{${providers.shift()?.codeInject}}catch(_){}${setInject(providers)}`;

const ThemeScript = memo(
  ({
    storageProviders,
    attribute,
    mediaQuery,
    defaultTheme,
    darkTheme,
    lightTheme,
  }: {
    storageProviders: StorageProviderType[];
    attribute: `data-${string}` | "class";
    mediaQuery: boolean;
    defaultTheme: string;
    darkTheme: string;
    lightTheme: string;
  }) => {
    // My attempt at minimizing the script code
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
        <script
          dangerouslySetInnerHTML={{
            __html: `${getElement}!function(){${setInject(storageProviders)}${
              mediaQuery &&
              `try{e??e=window.matchMedia("(prefers-color-scheme: dark)").matches?"${darkTheme}":"${lightTheme}")}catch(_){}`
            }e??(e="${defaultTheme}");${setAttr("e")}}();`,
          }}
        />
      </Head>
    );
  }
);
const ThemeProvider: FC<ThemeProviderProps> = ({
  attribute = Defaults.attribute,
  defaultTheme = Defaults.defaultTheme,
  storageProviders = Defaults.storageProviders,
  darkTheme = Defaults.darkTheme,
  lightTheme = Defaults.lightTheme,
  setAttribute = Defaults.setAttribute,
  mediaQuery = Defaults.mediaQuery,
  themes = [lightTheme, darkTheme],
  children,
}: ThemeProviderProps) => {
  const [activeTheme, setActiveTheme] = useState<string | undefined>();

  // Keeps our storage providers updated
  useEffect(() => {
    if (activeTheme !== undefined)
      storageProviders.forEach(
        (theme) => theme.onChange && theme.onChange(activeTheme)
      );
  }, [activeTheme, storageProviders]);

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
  const handleChange: (theme: string) => void = useCallback(
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

  useEffect(() => {
    storageProviders.forEach(
      (item) => item.setListener && item.setListener(handleChange)
    );
  }, [handleChange, storageProviders]);

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
        storageProviders={storageProviders}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
