/* eslint-disable import/prefer-default-export */
// Create a mock of the window.matchMedia function
// Based on: https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
export const systemMediaMock = () =>
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

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

export const sessionStorageMock = () =>
  Object.defineProperty(window, "sessionStorage", {
    value: localStorageInternal(),
  });
