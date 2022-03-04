import React, { useEffect, FC, useCallback, useState, useMemo } from "react";
import Script from "next/script";
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
  themes: [],
  value: null,
  resolvedTheme: null,
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

const getThemes = (themes: string[], darkTheme: string, lightTheme: string) => {
  if (themes && themes.includes("system")) {
    return themes;
  }
  return themes ? ["system", ...themes] : [darkTheme, lightTheme, "system"];
};

const getToggles = (themes: string[], darkTheme: string, lightTheme: string) =>
  themes
    ? themes.filter((theme) => theme !== "system")
    : [darkTheme, lightTheme];

const Provider: FC<ProviderProps> = ({
  mediaQuery = DefaultProps.mediaQuery,
  attribute = DefaultProps.attribute,
  themes: mThemes,
  darkTheme = DefaultProps.darkTheme,
  lightTheme = DefaultProps.lightTheme,
  defaultTheme = DefaultProps.defaultTheme,
  storageHandlers = DefaultProps.storageHandlers,
  respectHandlerOrder = DefaultProps.respectHandlerOrder,
  toggleThemes: mToggleThemes,
  onChange,
  children,
}: ProviderProps) => {
  // Set out default props
  const mounted = useIsMounted();

  const [themes, setThemes] = useState(
    getThemes(mThemes, darkTheme, lightTheme)
  );
  const [toggleThemes, setToggleThemes] = useState(
    getToggles(mThemes, darkTheme, lightTheme)
  );

  useEffect(() => {
    setThemes(getThemes(mThemes, darkTheme, lightTheme));
  }, [darkTheme, lightTheme, mThemes]);

  useEffect(() => {
    setToggleThemes(getToggles(mThemes, darkTheme, lightTheme));
  }, [darkTheme, lightTheme, mThemes, mToggleThemes]);

  const matches = useDarkMediaQuery();

  // Gets the theme with respect to our handlers
  const getRespectedTheme = useCallback((): ThemeState => {
    let resolvedTheme;
    storageHandlers.forEach((handler) => {
      const tempTheme = handler.getTheme();
      if (tempTheme && themes.includes(tempTheme)) resolvedTheme = tempTheme;
    });

    if (!resolvedTheme) {
      if (!isBrowser) {
        resolvedTheme = null;
      } else if (themes.includes(defaultTheme)) {
        resolvedTheme = defaultTheme;
      } else {
        console.error(
          `Unknown theme: ${defaultTheme}. Have you included it in the themes prop?`
        );
        resolvedTheme = "system";
      }
    }

    let theme = resolvedTheme;
    if (theme === "system") theme = matches ? darkTheme : lightTheme;
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
      themes: toggleThemes,
      handleChange,
      value: themeState.theme,
      resolvedTheme: themeState.resolvedTheme,
    }),
    [handleChange, themeState.resolvedTheme, themeState.theme, toggleThemes]
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

  const script = `!function(){var e;${handleInject}${
    mediaQuery ? `e||(e="system");` : `e||(e="${defaultTheme}");`
  }e==="system"&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"${darkTheme}":"${lightTheme}");${setAttr}}();`;

  const src = `data:text/javascript;base64,${
    isBrowser ? window.btoa(script) : Buffer.from(script).toString("base64")
  }`;

  return (
    <>
      <Script
        id="next-use-themes"
        strategy="beforeInteractive"
        src={src}
        defer={false}
      />
      <ThemeContext.Provider value={providerValue}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};

export default Provider;
