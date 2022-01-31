import { ReactNode } from "react";
import { StorageProviderType } from "./storage/storage.types";

export interface ThemeProviderProps {
  /** Use media query to toggle the theme between light and dark */
  mediaQuery?: boolean;
  /** Should we set the HTML attribute, defaults to true. If set to false handling the theme change is up to you */
  setAttribute?: boolean;
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
  storageProviders?: StorageProviderType[];
  /** The components children */
  children?: ReactNode;
}

// This is the type for our context usage
export interface UseThemeContext {
  /** List of all available theme names, defaults to the two props [lightTheme, darkTheme], eg ["lightTheme", "darkTheme"] */
  themes: string[];
  /** The function to call when we want to change the theme */
  handleChange: (theme: string) => void;
  /** The current theme value */
  value: string;
}
