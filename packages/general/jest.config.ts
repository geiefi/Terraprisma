import { JestConfigWithTsJest } from 'ts-jest';

export default {
  preset: 'solid-jest/preset/browser',
  setupFilesAfterEnv: [
    '<rootDir>/node_modules/@testing-library/jest-dom/extend-expect'
  ]
} satisfies JestConfigWithTsJest;
