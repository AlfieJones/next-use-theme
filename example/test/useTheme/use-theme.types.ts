export type UseThemeType = {
  // The current theme set
  theme: string;
  // Change the current theme, only themes listed to the provider are accepted
  setTheme: (theme: string) => void;
  // Toggle the theme, this goes through the toggle themes listed to the provider
  toggle: () => void;
  // Same as theme unless system theme is set, then shows 'system' while theme holds dark/light (set by provider)
  resolvedTheme: string;
};
