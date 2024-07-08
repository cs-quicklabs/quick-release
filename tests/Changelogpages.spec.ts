import { Changelogdetail } from "../e2e/ChangelogPage";
import { LoginPage } from "../e2e/Login";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on newchange log ",
  async ({ page }) => {
    const login = new LoginPage(page); // 30 seconds
    await page.goto("/");
    await login.login("divanshu@crownstack.com", "Divanshu@123");
  }
);

test(" Verify change log Page data ", async ({ page }) => {
  const changelog = new Changelogdetail(page);
  await changelog.changelogelements();
});

test("Verify user able to Edit changelog ", async ({ page }) => {
  const changelog = new Changelogdetail(page);
  await changelog.editchangelog();
});

test(" Verify user able to Delete changelog", async ({ page }) => {
  const changelog = new Changelogdetail(page);
  await changelog.deletechangelog();
});
