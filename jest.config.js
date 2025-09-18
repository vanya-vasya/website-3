const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testMatch: [
    '**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-gfm|unified|bail|is-plain-obj|trough|vfile|unist-util-stringify-position|micromark|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|hast-util-parse-selector|hastscript|web-namespaces|zwitch|html-void-elements|ccount|escape-string-regexp|markdown-table|mdast-util-find-and-replace|mdast-util-to-markdown|mdast-util-from-markdown|mdast-util-to-string|unist-util-visit|unist-util-is)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
