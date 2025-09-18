import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(() => ({
    userId: 'test-user-id',
    isLoaded: true,
    isSignedIn: true,
  })),
  auth: jest.fn(() => ({
    userId: 'test-user-id',
  })),
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock environment variables
process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL = 'https://test.n8n.cloud/webhook/test-id'

// Setup fetch mock
global.fetch = jest.fn()

// Mock File and FileReader for image upload tests
global.File = class MockFile {
  constructor(bits, filename, options = {}) {
    this.bits = bits
    this.name = filename
    this.size = bits.reduce((acc, bit) => acc + bit.length, 0)
    this.type = options.type || ''
    this.lastModified = options.lastModified || Date.now()
  }
}

global.FileReader = class MockFileReader {
  readAsDataURL() {
    setTimeout(() => {
      this.result = 'data:image/jpeg;base64,fake-base64-data'
      this.onload?.({ target: this })
    }, 0)
  }
}
