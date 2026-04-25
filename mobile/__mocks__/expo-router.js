module.exports = {
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Link: ({ children }) => children,
  Stack: { Screen: () => null },
  Tabs: { Screen: () => null },
};
