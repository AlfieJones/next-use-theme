import React from "react";
import { useTheme } from "../../src";

// A basic component which displays the current theme
export const Basic = () => {
  const { theme, resolvedTheme } = useTheme();

  return (
    <>
      <p data-testid="theme">{theme}</p>
      <p data-testid="trueTheme">{resolvedTheme}</p>
    </>
  );
};

export default Basic;
