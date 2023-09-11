/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './tests/globalSetup.cjs',
  globalTeardown: './tests/globalTeardown.cjs',
  coveragePathIgnorePatterns: ['./tests', '/node_modules/'],
};
