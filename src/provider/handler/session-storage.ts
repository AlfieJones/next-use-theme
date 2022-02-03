import { useEffect } from "react";
import { HandlerConfig, Handler, defaultConfig } from "./handler.types";

const codeInject = (key: string) => `sessionStorage.getItem('${key}')`;

const handleChange = (key: string) => (theme: string) => {
  if (typeof window !== "undefined") sessionStorage.setItem(key, theme);
};

const getTheme = (key: string) => () =>
  typeof window !== "undefined" ? sessionStorage.getItem(key) : null;

const setListener = (key: string) => (fn: (theme: string | null) => void) => {
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === key && e.oldValue !== e.newValue) {
        fn(e.newValue);
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
