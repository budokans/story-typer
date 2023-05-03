import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  collectCoverageFrom: ["<rootDir>/scraper/**/*.ts"],
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
  moduleNameMapper: {
    "firebase-admin/firestore": "firebase-admin/lib/firestore",
    "firebase-admin/app": "firebase-admin/lib/app",
  },
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "node",
  transformIgnorePatterns: ["node_modules/(?!(firelordjs)/)"],
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
  },
};

export default config;
