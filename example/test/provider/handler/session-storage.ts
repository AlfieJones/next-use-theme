import { useEffect } from "react";
import { isBrowser } from "../../utils";
import { HandlerConfig, Handler, defaultConfig, HandlerTypes } from "./handler.types";

const codeInject = (key: string) => `sessionStorage.getItem('${key}')`;

const handleChange = (key: string) => (theme: string, type: HandlerTypes) => {
  if (isBrowser && type !== "sessionStorage") sessionStorage.setItem(key, theme);
};

const getTheme = (key: string) => () =>
  isBrowser ? sessionStorage.getItem(key) : null;

const setListener = (key: string) => (fn: (theme: string | null, type: HandlerTypes) => void) => {
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === key && e.oldValue !== e.newValue) {
        fn(e.newValue, "sessionStorage");
      }
    };

    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [fn]);
};

export default ({
  key,
  storeUpdates,
}: HandlerConfig = defaultConfig): Handler => ({
  codeInject: codeInject(key),
  onChange: storeUpdates ? handleChange(key) : () => {},
  getTheme: getTheme(key),
  setListener: setListener(key),
});
