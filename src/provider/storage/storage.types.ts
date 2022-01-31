// This is the type for our storage providers
export interface GetStorageProviderType {
  /** Type of hte storage provider */
  type: "URL" | "LocalStorage" | "Cookie";
  /** The key for storing */
  key?: string;
  /** Should the provider change it's store to reflect the current value */
  storeUpdates?: boolean;
}

// This is the type for our storage providers
export interface StorageProviderType {
  /** Code to be injected */
  codeInject: string;
  /** The key for storing */
  onChange?: (theme: string) => void;
  /** Returns the theme stored */
  getTheme?: () => string | undefined;
  /** Returns the theme stored */
  setListener?: (fn: (theme: string) => void) => void;
}
