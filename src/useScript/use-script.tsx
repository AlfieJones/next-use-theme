import React from "react";
import { Handler, ProviderProps } from "../provider";
import { UseScriptType } from "./use-script.types";

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

const useScript: UseScriptType = (config: ProviderProps) => {
  const {
    attribute,
    storageHandlers,
    defaultTheme,
    mediaQuery,
    darkTheme,
    lightTheme,
  } = config;

  return (
    <script>{`!function(){var e;${setInject(storageHandlers)}${
      mediaQuery ? `e||(e="system");` : `e||(e="${defaultTheme}");`
    }e==="system"&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"${darkTheme}":"${lightTheme}");${getSetAttr(
      attribute
    )}}();`}</script>
  );
};

export default useScript;
