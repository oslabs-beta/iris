import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**./*.js'
  ],
  testEnvironment: 'node',
  testMatch:['**.test.js'],
  testPathIgnorePatterns: [
    './config/',
    './kafkaTest/',
    './node_modules/'
  ]
};

export default config;