module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  moduleNameMapper: {
    // Mock for icons to prevent errors in the Jest environment
    '../components/icons': '<rootDir>/tests/__mocks__/icons.mock.tsx',
    '^@google/genai$': '<rootDir>/tests/__mocks__/genai.mock.ts'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(?:@google/genai)/)'
  ],
  // Find tests in the tests directory
  testMatch: [
    "<rootDir>/tests/**/*.test.[jt]s?(x)"
  ],
};

