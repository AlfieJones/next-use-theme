import { ReactNode } from "react";
import { Handler, localStorage } from "./handler";

export const DefaultProps = {
  mediaQuery: true,
  attribute: "class" as "class" | `data-${string}`,
  darkTheme: "dark",
  lightTheme: "light",
  defaultTheme: "system",
  storageHandlers: [localStorage()],
  respectHandlerOrder: false,
};

// TODO improve typings
export type ProviderProps = {
  /** Use media query to toggle the theme between light and dark. If true and no storage handlers find a theme, next-theme falls back onto the media query */
  mediaQuery?: boolean;
  /** The HTML attribute to be set. Defaults to class */
  attribute?: `data-${string}` | "class";
  /** List of all available theme names, defaults to the two props [lightTheme, darkTheme], eg ["lightTheme", "darkTheme"] */
  themes?: string[];
  /** Dark theme name */
  darkTheme?: string;
  /** Light theme name */
  lightTheme?: string;
  /** Default theme */
  defaultTheme?: string;
  /** Theme Providers */
  storageHandlers?: Handler[];
  /** If true, when a handler changes we only use the value of the first handler to yield a valid theme. If false, we accept the new value if valid */
  respectHandlerOrder?: boolean;
  /** Themes for the toggle to loop through */
  toggleThemes?: string[];
  /** Handle the theme change yourself. Setting this disables next-theme from setting the attribute */
  onChange?: (theme: string) => {};
  /** The components children */
  children?: ReactNode;
};

// This is the type for our context usage
export type UseThemeContext = {
  /** List of all available theme names, defaults to the two props [lightTheme, darkTheme], eg ["lightTheme", "darkTheme"] */
  themes: string[];
  /** The function to call when we want to change the theme */
  handleChange: (theme: string) => void;
  /** The current theme value, if system then returns light/dark */
  value: string;
  /** The current theme value including if system is set */
  resolvedTheme: string;
};
