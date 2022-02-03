import React, { useEffect, FC, useCallback, useState, useMemo } from "react";
import Head from "next/head";
import { UseThemeContext, DefaultProps, ProviderProps } from "./provider.props";
import { Handler } from "./handler";
import { isBrowser, useDarkMediaQuery, useIsMounted } from "../utils";

export const ThemeContext = React.createContext<UseThemeContext>({
  themes: [DefaultProps.lightTheme, DefaultProps.darkTheme],
  value: DefaultProps.defaultTheme,
  resolvedTheme: DefaultProps.defaultTheme,
  handleChange: () => {},
});

// Recursively add our prover injections
const setInject = (
  providers: Handler[],
  index: number = providers.length - 1
): string =>
  index === -1
    ? ""
    : `try{${`e=${providers[index]?.codeInject}`}}finally{${setInject(
        providers,
        index - 1
      )}}`;

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
  const getRespectedTheme = useCallback(() => {
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

    return theme;
  }, [storageHandlers, defaultTheme, themes]);

  const getActive = (theme: string | null) => {
    if (theme === "system") {
      return matches ? darkTheme : lightTheme;
    }
    return theme;
  };

  const [resolvedTheme, setResolvedTheme] = useState<string | null>(
    getRespectedTheme()
  );
  const [activeTheme, setActiveTheme] = useState<string | null>(
    getActive(resolvedTheme)
  );

  // Handles our theme changes
  const handleChange: (theme: string) => void = useCallback(
    (theme: string) => {
      if (theme === "system") {
        setResolvedTheme("system");
        setActiveTheme(matches ? darkTheme : lightTheme);
      } else if (themes.includes(theme)) {
        setActiveTheme(theme);
        setResolvedTheme(theme);
      } else {
        console.error(
          `Unknown theme: ${theme}. Have you included it in the themes prop?`
        );
        // We default to system theme if no previous theme is active
        if (resolvedTheme === null) {
          setResolvedTheme("system");
          setActiveTheme(matches ? darkTheme : lightTheme);
        }
      }
    },
    [darkTheme, lightTheme, matches, resolvedTheme, themes]
  );

  // Watch for system theme changes
  useEffect(() => {
    if (mediaQuery && mounted) {
      if (resolvedTheme === "system") handleChange("system");
      else handleChange(matches ? darkTheme : lightTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, mounted]);

  const handleProviderChange = useCallback(
    (theme: string | null) => {
      if (respectHandlerOrder) {
        setActiveTheme(getRespectedTheme());
      } else if (theme && themes.includes(theme)) {
        setActiveTheme(theme);
      } else {
        setActiveTheme(defaultTheme);
      }
    },
    [
      defaultTheme,
      themes,
      respectHandlerOrder,
      getRespectedTheme,
      setActiveTheme,
    ]
  );

  storageHandlers.forEach((handler) =>
    handler.setListener(handleProviderChange)
  );

  // Handle theme changing
  useEffect(() => {
    if (resolvedTheme && activeTheme) {
      storageHandlers.forEach((handler) => {
        handler.onChange(resolvedTheme);
      });
      if (onChange) {
        onChange(activeTheme, resolvedTheme);
      } else {
        const root = document.documentElement;
        if (attribute === "class") {
          root.classList.remove(...themes);
          root.classList.add(activeTheme);
        } else {
          root.setAttribute(attribute, activeTheme);
        }
      }
    }
  }, [
    activeTheme,
    attribute,
    onChange,
    resolvedTheme,
    storageHandlers,
    themes,
  ]);

  // Context for our hook
  const providerValue: UseThemeContext = useMemo(
    () => ({
      themes,
      handleChange,
      value: activeTheme,
      resolvedTheme,
    }),
    [activeTheme, handleChange, resolvedTheme, themes]
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
            __html: `!function(){var e${
              mediaQuery
                ? `=window.matchMedia("(prefers-color-scheme: dark)").matches?"${darkTheme}":"${lightTheme}";`
                : `;`
            }${handleInject}e||(e="${defaultTheme}");${setAttr}}();`,
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
