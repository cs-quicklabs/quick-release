import { defineConfig, devices } from "@playwright/test";
import path from "path";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
 
  timeout: 1 * 80 * 1000,
  expect: {
    timeout: 1 * 80 * 1000,
  },
  testDir: path.join(__dirname, "tests"),
  // testMatch: "**/*.spec.ts",
  /* Run tests in files in parallel */
  fullyParallel:true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
 
  /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  retries:3,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://quick-release-development.vercel.app",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    headless: true,
  },
  
  // timeout: 5* 60 * 1000,
  /* Configure projects for major browsers */
  projects: [


    {
      name: "sanity",
      testDir: "./tests",
      testMatch: /.*(Login|Changelogs|Profile|Changepasswords|viewpublic|Signout|addaTags|addprojects|Category)\.spec\.ts$/,
    },
    {
      name: "regression",
      testDir: "./tests",
      testMatch: /.*(loginTest)\.spec\.ts$/,
    },
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },

    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop chromium'] },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'Safari',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
  
});
