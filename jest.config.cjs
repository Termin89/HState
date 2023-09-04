module.exports = {
  testEnvironment: "jest-environment-node",
  preset: 'ts-jest',
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
};
