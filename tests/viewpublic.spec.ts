import { ChangelogDetail } from "../e2e/ChangelogPage";
import { LoginPage } from "../e2e/Login";
import { viewPublic } from "../e2e/Viewpublic";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on new changelog ",
  async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto("/");
    await login.login("divanshu@crownstack.com", "pass1234");
  }
);

test(" Verify change log public view ", async ({ page }) => {
  const view = new viewPublic(page);
  await view.viewChangelogDetails();
});
