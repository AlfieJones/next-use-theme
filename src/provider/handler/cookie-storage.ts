import { useEffect } from "react";
import Cookies from "js-cookie";
import { isBrowser } from "../../utils";
import {
  HandlerConfig,
  Handler,
  defaultConfig,
  HandlerTypes,
} from "./handler.types";

const codeInject = (key: string) =>
  `document.cookie.match('(^|;)\\s*${key}\\s*=\\s*([^;]+)').pop()`;

const handleChange = (key: string) => (theme: string, type: HandlerTypes) => {
  if (type !== "cookie" && isBrowser) {
    Cookies.set(key, theme);
  }
};

const getTheme = (key: string) => () => isBrowser ? Cookies.get(key) : null;

// CookieStore doesn't have a lot of adoption https://caniuse.com/?search=cookie%20store%20api
const setListener =
  (key: string) => (fn: (theme: string | null, type: HandlerTypes) => void) => {
    useEffect(() => {
      const listener = (e: any) => {
        e.changed.forEach((element: any) => {
          if (element.name === key) {
            fn(element.value, "cookie");
          }
        });
      };
      try {
        // @ts-ignore
        cookieStore.addEventListener("change", listener);
        // eslint-disable-next-line no-empty
      } catch {}

      return () => {
        try {
          // @ts-ignore
          cookieStore.removeEventListener("change", listener);
          // eslint-disable-next-line no-empty
        } catch {}
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
