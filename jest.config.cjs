module.exports = {
  testEnvironment: "jest-environment-node",
  preset: 'ts-jest',
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
