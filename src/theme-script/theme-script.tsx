import React, { FC } from "react";
import { Handler, ThemeConfig } from "../provider";
import { DefaultProps } from "../provider/provider.types";

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

// Adds our element to change
const getSetAttr = (attribute: string) => {
  if (attribute === "class") {
    return "document.documentElement.classList.add(e);";
  }
  return `document.documentElement.setAttribute('${attribute}',e);`;
};

const ThemeScript: FC<ThemeConfig> = ({
  attribute = DefaultProps.attribute,
  storageHandlers = DefaultProps.storageHandlers,
  defaultTheme = DefaultProps.defaultTheme,
  mediaQuery = DefaultProps.mediaQuery,
  darkTheme = DefaultProps.darkTheme,
  lightTheme = DefaultProps.lightTheme,
  colorScheme = DefaultProps.colorScheme,
}: ThemeConfig) => {
  const codeInject = `!function(){var e;${setInject(storageHandlers)}${
    mediaQuery ? `e||(e="system");` : `e||(e="${defaultTheme}");`
  }e==="system"&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"${darkTheme}":"${lightTheme}");${getSetAttr(
    attribute
  )}}();`;

  return (
    <>
      {colorScheme && (
        <meta
          name="color-scheme"
          content={defaultTheme === "dark" ? "dark light" : "light dark"}
        />
      )}
      <script dangerouslySetInnerHTML={{ __html: codeInject }} />
    </>
  );
};

export default ThemeScript;
