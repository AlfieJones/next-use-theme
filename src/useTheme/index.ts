import { useCallback, useContext, useMemo } from "react";
import { ThemeContext } from "../provider";

const useTheme = () => {
  const { handleChange, themes, value } = useContext(ThemeContext);

  const setTheme = useCallback(
    (theme: string) => handleChange(theme),
    [handleChange]
  );

  const theme = useMemo(() => value, [value]);

  const toggle = useCallback(
    () => setTheme(themes[(themes.indexOf(theme) + 1) % themes.length]),
    [setTheme, theme, themes]
  );

  return {
    theme,
    setTheme,
    toggle,
  };
};

export default useTheme;
