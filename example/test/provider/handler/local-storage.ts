import { useEffect } from "react";
import isBrowser from "../../utils/isBrowser";
import { HandlerConfig, Handler, defaultConfig, HandlerTypes } from "./handler.types";

const codeInject = (key: string) => `localStorage.getItem('${key}')`;

const handleChange = (key: string) => (theme: string, type: HandlerTypes) => {
  if (isBrowser && type !== "localStorage") {
    localStorage.setItem(key, theme)};
};

const getTheme = (key: string) => () =>
  isBrowser ? localStorage.getItem(key) : null;

const setListener = (key: string) => (fn: (theme: string | null, type: HandlerTypes) => void) => {
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === key && e.oldValue !== e.newValue) {
        fn(e.newValue, "localStorage");
        console.log(e);
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