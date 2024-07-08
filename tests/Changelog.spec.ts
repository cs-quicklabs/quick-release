import { Changelog } from "../e2e/Changelog";
import { LoginPage } from "../e2e/Login";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on newchange log ",
  async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto("/");
    await login.login("divanshu@crownstack.com", "Divanshu@123");
  }
);
test("Verify user able to cancel change log", async ({ page }) => {
  const changelog = new Changelog(page);
  await changelog.cancelchangelog();
});

// test(" Verify admin should able to Save log draft ", async ({ page }) => {
//   const changelog = new Changelog(page);
//   await changelog.savechangelog();
// });

test(" Verify admin should able to publish change log ", async ({ page }) => {
  const changelog = new Changelog(page);
  await changelog.publishchangelog();
});
