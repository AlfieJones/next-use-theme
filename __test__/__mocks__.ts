/* eslint-disable import/prefer-default-export */
export const systemMediaMock = () => 
  Object.defineProperty(window, "matchMedia", jest.fn().mockImplementation((query) => ({
    matches: query === "(prefers-color-scheme: dark)",
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })
  )

);

const localStorageInternal = () => {
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

export const localStorageMock = () =>
  Object.defineProperty(window, "localStorage", {
    value: localStorageInternal(),
  });
