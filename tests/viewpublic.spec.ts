import { LoginPage } from "../e2e/login.js";
import { viewPublic } from "../e2e/viewpublic";
import { validCredentials } from "../e2e/testData/credential";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on new changelog ",
  async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto("/");
    await login.login(validCredentials.mail, validCredentials.password);
  }
);

test(" Verify change log public view ", async ({ page }) => {
  const view = new viewPublic(page);
  await view.viewChangelogDetails();
});
