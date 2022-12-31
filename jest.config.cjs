// import type {Config} from 'jest';

const config = {
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/client/home/**',
    '**/client/home/components/**',
    '**/client/home/containers/**',
    '**/client/home/**',
    '**/client/*.jsx',
    '**/client/*.js',
    '**/server/controllers/**',
    '**/server/routes/**',
    '**/server/server.ts',
    // Ignore the below files
    '!**/dummyData/*.js',
  ],
  testEnvironment: 'jsdom',
  testMatch:['**.test.js','**.test.ts'],
  testPathIgnorePatterns: [
    './config/',
    './kafkaTest/',
    './node_modules/'
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
};

module.exports = config;