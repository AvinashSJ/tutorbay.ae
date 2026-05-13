module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": ["@swc/jest", {
      jsc: {
        parser: {
          syntax: "ecmascript",
          jsx: true,
        },
        transform: {
          react: {
            runtime: "automatic",
          },
        },
      },
    }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.(js|jsx)"],
};
