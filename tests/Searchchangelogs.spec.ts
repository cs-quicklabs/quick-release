import { LoginPage } from "../Pages/Login";
import { searchchangelog } from "../Pages/Searchchangelog";
import { Changelog } from "../Pages/changelog";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on newchange log ",
  async ({ page }) => {
    const login = new LoginPage(page); // 30 seconds
    await login.gotoLoginPage();
    await login.login("divanshu@crownstack.com", "pass1234");
  }
);

test(" Verify admin should able to publish change log ", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const changelog = new Changelog(page);
  await changelog.publishchangelog();
});

test(" Verify admin should able to search changelogs ", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const search = new searchchangelog(page);
  await search.searchchangelog();
});
