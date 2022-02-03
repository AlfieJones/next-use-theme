import React, { useEffect, FC, useCallback, useState, useMemo } from "react";
import Head from "next/head";
import {
  UseThemeContext,
  DefaultProps,
  ProviderProps,
  ThemeState,
} from "./provider.types";
import { Handler } from "./handler";
import { isBrowser, useDarkMediaQuery, useIsMounted } from "../utils";
import { HandlerTypes } from "./handler/handler.types";

export const ThemeContext = React.createContext<UseThemeContext>({
  themes: [DefaultProps.lightTheme, DefaultProps.darkTheme],
  value: DefaultProps.defaultTheme,
  resolvedTheme: DefaultProps.defaultTheme,
  handleChange: () => {},
});

// Recursively add our prover injections
// TODO Investigate need for try catch
const setInject = (providers: Handler[], index: number = 0): string => {
  if (providers.length === 0 || index === providers.length) {
    return "";
  }
  if (index === 0) {
    return `try{e=${providers[index]?.codeInject};}catch(_){}${setInject(
      providers,
      index + 1
    )}`;
  }
  return `try{e||(e=${providers[index]?.codeInject});}catch(_){}${setInject(
    providers,
    index + 1
  )}`;
};

const Provider: FC<ProviderProps> = ({
  mediaQuery = DefaultProps.mediaQuery,
  attribute = DefaultProps.attribute,
  themes,
  darkTheme = DefaultProps.darkTheme,
  lightTheme = DefaultProps.lightTheme,
  defaultTheme = DefaultProps.defaultTheme,
  storageHandlers = DefaultProps.storageHandlers,
  respectHandlerOrder = DefaultProps.respectHandlerOrder,
  toggleThemes,
  onChange,
  children,
}: ProviderProps) => {
  // Set out default props
  if (!themes) themes = [lightTheme, darkTheme];
  if (!toggleThemes) toggleThemes = themes;
  themes.push("system");

  const matches = useDarkMediaQuery();

  const mounted = useIsMounted();

  // Gets the theme with respect to our handlers
  const getRespectedTheme = useCallback((): ThemeState => {
    let theme;
    storageHandlers.forEach((handler) => {
      const tempTheme = handler.getTheme();
      if (tempTheme && themes.includes(tempTheme)) theme = tempTheme;
    });

    if (!theme) {
      if (!isBrowser) {
        theme = null;
      } else if (themes.includes(defaultTheme)) {
        theme = defaultTheme;
      } else {
        console.error(
          `Unknown theme: ${defaultTheme}. Have you included it in the themes prop?`
        );
        theme = "system";
      }
    }

    let resolvedTheme = null;
    if (theme === "system") resolvedTheme = matches ? darkTheme : lightTheme;
    return { theme, resolvedTheme };
  }, [storageHandlers, matches, darkTheme, lightTheme, themes, defaultTheme]);

  const [themeState, setThemeState] = useState<ThemeState>(getRespectedTheme());

  // Handles our theme changes
  const handleChange = useCallback(
    (newTheme: string, triggerType?: HandlerTypes) => {
      let theme = newTheme;
      let resolvedTheme = newTheme;
      if (!themes.includes(newTheme)) {
        console.error(
          `Unknown theme: ${theme}. Have you included it in the themes prop?`
        );
        if (themeState.resolvedTheme === null) resolvedTheme = defaultTheme;
      }

      if (resolvedTheme === "system") theme = matches ? darkTheme : lightTheme;

      setThemeState({ theme, resolvedTheme, triggerType });
    },
    [
      darkTheme,
      defaultTheme,
      lightTheme,
      matches,
      themeState.resolvedTheme,
      themes,
    ]
  );

  // Watch for system theme changes
  useEffect(() => {
    if (mediaQuery && mounted) {
      if (themeState.resolvedTheme === "system") handleChange("system");
      else handleChange(matches ? darkTheme : lightTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, mounted]);

  const handleProviderChange = useCallback(
    (theme: string | null, type: HandlerTypes) => {
      if (respectHandlerOrder) {
        const respected = getRespectedTheme();
        if (respected.resolvedTheme)
          handleChange(respected.resolvedTheme, type);
        else handleChange("system");
      } else if (theme) {
        handleChange(theme, type);
      }
    },
    [respectHandlerOrder, getRespectedTheme, handleChange]
  );

  storageHandlers.forEach((handler) =>
    handler.setListener(handleProviderChange)
  );

  // Handle theme changing
  useEffect(() => {
    if (themeState.resolvedTheme && themeState.theme) {
      storageHandlers.forEach((handler) => {
        handler.onChange(themeState.resolvedTheme, themeState.triggerType);
      });
      if (onChange) {
        onChange(themeState.resolvedTheme, themeState.resolvedTheme);
      } else {
        const root = document.documentElement;
        if (attribute === "class") {
          root.classList.remove(...themes);
          root.classList.add(themeState.theme);
        } else {
          root.setAttribute(attribute, themeState.theme);
        }
      }
    }
  }, [attribute, onChange, themeState, storageHandlers, themes]);

  // Context for our hook
  const providerValue: UseThemeContext = useMemo(
    () => ({
      themes,
      handleChange,
      value: themeState.theme,
      resolvedTheme: themeState.resolvedTheme,
    }),
    [handleChange, themeState.resolvedTheme, themeState.theme, themes]
  );

  // The attribute we're editing
  const setAttr = useMemo(() => {
    if (attribute === "class") {
      return "document.documentElement.classList.add(e);";
    }
    return `document.documentElement.setAttribute('${attribute}',e);`;
  }, [attribute]);

  // Code to be run on page load. This uses our storage handlers
  const handleInject = useMemo(
    () => setInject(storageHandlers),
    [storageHandlers]
  );

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){var e;${handleInject}${
              mediaQuery ? `e||(e="system");` : `e||(e="${defaultTheme}");`
            }e==="system"&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"${darkTheme}":"${lightTheme}");${setAttr}}();`,
          }}
        />
      </Head>
      <ThemeContext.Provider value={providerValue}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};

export default Provider;
