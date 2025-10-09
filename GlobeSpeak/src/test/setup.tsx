import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options && typeof options === 'object') {
        let result = key;
        Object.keys(options).forEach(optionKey => {
          result = result.replace(`{{${optionKey}}}`, options[optionKey]);
        });
        return result;
      }
      return key;
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
      exists: vi.fn(() => true),
      on: vi.fn(),
      off: vi.fn()
    }
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn()
  }
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ element }: { element: React.ReactNode }) => element,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  Navigate: () => null,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => vi.fn()
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  const MockIcon = ({ size, className, ...props }: any) => (
    <svg
      width={size || 24}
      height={size || 24}
      className={className}
      data-testid="mock-icon"
      {...props}
    />
  );

  return new Proxy({}, {
    get: () => MockIcon
  });
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Intl APIs
global.Intl = {
  ...global.Intl,
  DateTimeFormat: vi.fn().mockImplementation(() => ({
    format: vi.fn((date) => new Date(date).toLocaleDateString())
  })),
  NumberFormat: vi.fn().mockImplementation(() => ({
    format: vi.fn((number) => number.toString())
  })),
  RelativeTimeFormat: vi.fn().mockImplementation(() => ({
    format: vi.fn((value, unit) => `${value} ${unit} ago`)
  }))
};

// Setup global test environment
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  
  // Reset localStorage
  localStorageMock.getItem.mockReturnValue(null);
  
  // Reset document properties
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
  document.title = 'Test';
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

// Suppress console errors in tests unless explicitly needed
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalError.call(console, ...args);
};
