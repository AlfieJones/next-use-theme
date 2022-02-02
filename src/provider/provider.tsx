import React, { useEffect, FC, useCallback, useState, useMemo } from "react";
import Head from "next/head";
import { UseThemeContext, DefaultProps, ProviderProps } from "./provider.props";
import { Handler } from "./handler";
import useDarkMediaQuery from "../utils/useMediaQuery";

export const ThemeContext = React.createContext<UseThemeContext>({
  themes: DefaultProps.themes,
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
  themes = DefaultProps.themes,
  darkTheme = DefaultProps.darkTheme,
  lightTheme = DefaultProps.lightTheme,
  defaultTheme = DefaultProps.defaultTheme,
  storageHandlers = DefaultProps.storageHandlers,
  respectHandlerOrder = DefaultProps.respectHandlerOrder,
  onChange,
  children,
}: ProviderProps) => {
  const getRespectedTheme = useCallback(() => {
    let theme;
    storageHandlers.forEach((handler) => {
      const tempTheme = handler.getTheme();
      if (tempTheme && themes.includes(tempTheme)) theme = tempTheme;
    });

    if (!theme && typeof window !== "undefined" && mediaQuery)
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? darkTheme
        : lightTheme;
    else theme = defaultTheme;

    return theme;
  }, [
    storageHandlers,
    mediaQuery,
    darkTheme,
    lightTheme,
    defaultTheme,
    themes,
  ]);

  const [resolvedTheme, setResolvedTheme] = useState<string>(
    getRespectedTheme()
  );
  const [activeTheme, setActiveTheme] = useState<string>(getRespectedTheme());

  const matches = useDarkMediaQuery();

  // Handles our theme changes
  const handleChange: (theme: string) => void = useCallback(
    (theme: string) => {
      if (theme === "system" && mediaQuery) {
        setResolvedTheme("system");
        setActiveTheme(matches ? darkTheme : lightTheme);
      } else if (themes.includes(theme)) {
        setActiveTheme(theme);
        setResolvedTheme(theme);
      } else {
        throw new Error(
          `Unknown theme: ${theme}. Have you included it in the themes prop?`
        );
      }
    },
    [darkTheme, lightTheme, matches, mediaQuery, themes]
  );

  useEffect(() => {
    if (mediaQuery) handleChange(matches ? darkTheme : lightTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

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
    storageHandlers.forEach((handler) => {
      handler.onChange(activeTheme);
    });
    if (onChange) {
      onChange(activeTheme);
    } else {
      const root = document.documentElement;
      if (attribute === "class") {
        root.classList.remove(...themes);
        root.classList.add(activeTheme);
      } else {
        root.setAttribute(attribute, activeTheme);
      }
    }
  }, [activeTheme, attribute, onChange, storageHandlers, themes]);

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
