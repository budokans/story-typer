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
  moduleDirectories: ["node_modules"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "@/lib/(.*)": ["<rootDir>/lib/$1"],
    "@/hooks/(.*)": ["<rootDir>/hooks/$1"],
    "@/components/(.*)": ["<rootDir>/components/$1"],
    "@/containers/(.*)": ["<rootDir>/containers/$1"],
    "@/context/(.*)": ["<rootDir>/context/$1"],
  },
};

export default config;
