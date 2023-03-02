import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverageFrom: [
    "<rootDir>/hooks/**",
    "<rootDir>/lib/**",
    "!<rootDir>/lib/firebase.ts",
    "!<rootDir>/lib/firestore.ts",
    "!**/*.types.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageReporters: ["html", "text"],
  rootDir: ".",
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "jsdom",
};

export default config;
