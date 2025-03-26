// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Add TypeScript support with ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true, // Enable ESM support
    }],
  },
  // Enable ESM support for .ts and .tsx files
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
