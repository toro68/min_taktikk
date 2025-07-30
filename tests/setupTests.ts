import '@testing-library/jest-dom';

// Mock SVG methods that don't exist in test environment
const mockSVGElement = (overrides: any = {}) => {
  const defaultRect = {
    x: 0,
    y: 0,
    width: 800,
    height: 520,
    top: 0,
    left: 0,
    bottom: 520,
    right: 800,
    toJSON: jest.fn()
  };

  const mockElement = {
    getBoundingClientRect: jest.fn(() => ({
      ...defaultRect,
      ...overrides
    })),
    // Don't provide createSVGPoint to force manual calculation fallback
    // This ensures consistent behavior across tests
    createSVGPoint: undefined,
    getScreenCTM: undefined,
    getAttribute: jest.fn((name: string) => {
      if (name === 'viewBox') return '0 0 1050 680';
      return null;
    })
  };
  return mockElement;
};

// Global test utilities - ensure this is properly defined
(global as any).testUtils = {
  mockSVGElement
};

// Mock console methods to reduce noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock ResizeObserver
(global as any).ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
(global as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
