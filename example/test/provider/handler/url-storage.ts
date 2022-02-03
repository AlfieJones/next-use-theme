import { useEffect } from "react";
import { HandlerConfig, Handler, defaultConfig, HandlerTypes } from "./handler.types";

const codeInject = (key: string) =>
  `(new URLSearchParams(location.search)).get('${key}');`;

const handleChange = (key: string) => (theme: string, type: HandlerTypes) => {
    if(type !== "url") localStorage.setItem(key, theme);
};

const getTheme = (key: string) => () => localStorage.getItem(key);

const setListener = (key: string) => (fn: (theme: string | null, type: HandlerTypes) => void) => {
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === key && e.oldValue !== e.newValue) {
        fn(e.newValue, "url");
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