import { useEffect } from "react";
import { isBrowser } from "../../utils";
import {
  HandlerConfig,
  Handler,
  defaultConfig,
  HandlerTypes,
} from "./handler.types";

const codeInject = (key: string) =>
  `(new URLSearchParams(window.location.search)).get('${key}')`;

const handleChange = (key: string) => (theme: string, type: HandlerTypes) => {
  if (type !== "url" && isBrowser) {
    const sParam = new URLSearchParams(window.location.search);
    sParam.set(key, theme);
    const path = `${window.location.protocol}//${window.location.host}${
      window.location.pathname
    }?${sParam.toString()}`;

    window.history.pushState({ path }, "", path);
  }
};

const getTheme = (key: string) => () =>
  isBrowser ? new URLSearchParams(window.location.search).get(key) : null;

const setListener =
  (key: string) => (fn: (theme: string | null, type: HandlerTypes) => void) => {
    const theme = getTheme(key)();

    useEffect(() => {
      fn(theme, "url");
    }, [fn, theme]);
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
