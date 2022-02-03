export const defaultConfig = {
  key: "theme",
  storeUpdates: true,
};

// This is the type for our storage providers
export type HandlerConfig = typeof defaultConfig & {
  /** The key for storing */
  key?: string;
  /** Should the provider change it's store to reflect the current value */
  storeUpdates?: boolean;
};

// This is the type for our storage providers
export type Handler = {
  /** Code to be injected on page load */
  codeInject: string;
  /** Called when the theme changes */
  onChange: (theme: string, type: HandlerTypes) => void;
  /** Returns the theme stored */
  getTheme: () => string | null;
  /** Sets the listener function */
  setListener: (fn: (theme: string | null, type: HandlerTypes) => void) => void;
};

export type HandlerTypes = "localStorage" | "sessionStorage" | "cookie" | "url";
