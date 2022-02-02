const localStorageMock: { [key: string]: string } = {};
const sessionStorageMock: { [key: string]: string } = {};

beforeAll(() => {
  // Create a mock of the window.matchMedia function
  // Based on: https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Create mocks of localStorage getItem and setItem functions
  global.Storage.prototype.getItem = jest.fn(
    (key: string) => localStorageMock[key]
  );
  global.Storage.prototype.setItem = jest.fn((key: string, value: string) => {
    localStorageMock[key] = value;
  });
});
