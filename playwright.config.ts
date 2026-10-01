import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 40000,
  expect: { timeout: 10000 },
  use: { baseURL: process.env.TEST_BASE_URL || "http://localhost:3000", channel: "chrome", headless: true, trace: "retain-on-failure" },
  reporter: [["list"], ["html", { open: "never" }]],
});
