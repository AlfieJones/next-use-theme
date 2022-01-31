import getStorageProvider from "./storage";

const Defaults = {
  attribute: "class" as "class" | `data-${string}`,
  darkTheme: "dark",
  defaultTheme: "light",
  lightTheme: "light",
  mediaQuery: true,
  setAttribute: true,
  storageProviders: [getStorageProvider({ type: "LocalStorage" })],
  themes: ["light", "dark"],
};

export default Defaults;
