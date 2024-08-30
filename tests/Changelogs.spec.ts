import { Changelog } from "../e2e/Changelogs";
import { LoginPage } from "../e2e/Login";
import { validCredentials } from "../e2e/testData/credential";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on newchangelog ",
  async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto("/");
    await login.login(validCredentials.mail, validCredentials.password);
  }
);

test(" Verify admin should able to publish change log ", async ({ page }) => {
  const changelog = new Changelog(page);
  await changelog.publishChangelog();
});

test("Verify user able to cancel change log", async ({ page }) => {
  const changelog = new Changelog(page);
  await changelog.cancelChangelog();
});

test(" Verify admin should able to Save log draft ", async ({ page }) => {
  const changelog = new Changelog(page);
  await changelog.saveChangelog();
});
