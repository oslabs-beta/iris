import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**./*.js'
  ],
  testEnvironment: 'node',
  testMatch:['**./*.js'],
  testPathIgnorePatterns: [
    './config/',
    './node_modules/'
  ]
};

export default config;