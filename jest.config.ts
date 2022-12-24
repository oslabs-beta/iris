import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/client/*.*'
  ],
  testEnvironment: 'jsdom',
  testMatch:['**.test.js'],
  testPathIgnorePatterns: [
    './config/',
    './kafkaTest/',
    './node_modules/'
  ]
};

export default config;