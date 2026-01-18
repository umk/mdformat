module.exports = {
  resetMocks: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: -40,
    },
  },
  coveragePathIgnorePatterns: ['/node_modules/', '__fixtures__'],
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  roots: ['<rootDir>'],
  transform: { '^.+\\.ts$': ['ts-jest', { useESM: true }] },
}
