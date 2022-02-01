import { useCallback, useContext } from "react";
import { ThemeContext } from "../provider";
import { UseThemeType } from "./use-theme.types";

const useTheme = (): UseThemeType => {
  const { handleChange, themes, value } = useContext(ThemeContext);

  const toggle = useCallback(
    () => handleChange(themes[(themes.indexOf(value) + 1) % themes.length]),
    [handleChange, themes, value]
  );

  return {
    theme: value,
    setTheme: handleChange,
    toggle,
  };
};

export default useTheme;
