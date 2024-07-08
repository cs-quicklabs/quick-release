import { Changelog } from "../e2e/Changelog";
import { LoginPage } from "../e2e/Login";
import { searchchangelog } from "../e2e/SearchLog";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on newchange log ",
  async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto("/");
    await login.login("divanshu@crownstack.com", "Divanshu@123");
  }
);

test(" Verify admin should able to search changelogs ", async ({ page }) => {
  const search = new searchchangelog(page);
  await search.searchlog();
});
