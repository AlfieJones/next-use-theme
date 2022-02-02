import React, { useEffect } from "react";

import { useTheme } from "../../src";

type ChangeThemeProps = {
  newTheme: string;
};

// A basic component which allows us to change the theme
export const ChangeTheme = ({ newTheme }: ChangeThemeProps) => {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setTheme(newTheme);
  }, [newTheme, setTheme]);

  return (
    <>
      <p data-testid="theme">{theme}</p>
      <p data-testid="newTheme">{newTheme}</p>
    </>
  );
};

export default ChangeTheme;
