import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverageFrom: [
    "<rootDir>/hooks/**",
    "<rootDir>/lib/**",
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
  moduleDirectories: ["node_modules"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "jsdom",
};

export default config;
