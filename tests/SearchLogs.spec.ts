import { LoginPage } from "@/e2e/login.js";
import { searchChangelog } from "@/e2e/searchLog";
import { validCredentials } from "@/e2e/testData/credential";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on new changelog ",
  async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto("/");
    await login.login(validCredentials.mail, validCredentials.password);
  }
);

test(" Verify admin should able to search changelogs ", async ({ page }) => {
  const search = new searchChangelog(page);
  await search.searchChangelog();
});
