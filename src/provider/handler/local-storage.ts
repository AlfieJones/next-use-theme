import { useEffect } from "react";
import isBrowser from "../../utils/isBrowser";
import { HandlerConfig, Handler, defaultConfig } from "./handler.types";

const codeInject = (key: string) => `localStorage.getItem('${key}')`;

const handleChange = (key: string) => (theme: string) => {
  if (isBrowser) localStorage.setItem(key, theme);
};

const getTheme = (key: string) => () =>
  isBrowser ? localStorage.getItem(key) : null;

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
