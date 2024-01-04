export default {
  setupFiles: ['./__tests__/env.ts'],
  testPathIgnorePatterns: ['./__tests__/env.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@lib(.*)$': '<rootDir>/src/lib$1',
  },
};
