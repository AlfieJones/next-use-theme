import React from "react";
import { useTheme } from "../../src";

// A basic component which displays the current theme
export const Basic = () => {
  const { theme } = useTheme();

  return (
    <>
      <p data-testid="theme">{theme}</p>
    </>
  );
};

export default Basic;
