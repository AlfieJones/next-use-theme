/* eslint-disable import/prefer-default-export */
export const mockSystemMedia = () => {
  global.window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query === "(prefers-color-scheme: dark)",
    media: "",
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
};

export const localStorageMock = () => {
  let store: { [key: string]: string } = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
};
