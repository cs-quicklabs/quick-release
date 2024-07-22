import { Changelog } from "../e2e/Changelogs";
import { LoginPage } from "../e2e/Login";
import { validCredentials } from "../e2e/testData/credential";
import { test, expect } from "@playwright/test";
import { ChangelogDetail } from "../e2e/ChangelogPage";

test.beforeEach(
  " Verify Admin able to click on newchangelog ",
  async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto("/");
    await page.waitForLoadState('load')
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

test(" Verify admin should able to edit and Save log draft ", async ({ page }) => {
  const changelog = new Changelog(page);
  await changelog.saveChangelog();
});

