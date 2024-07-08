import { Changelogdetail } from "../e2e/ChangelogPage";
import { LoginPage } from "../e2e/Login";
import { viewpublic } from "../e2e/Viewpublic";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on newchange log ",
  async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto("/");
    await login.login("divanshu@crownstack.com", "Divanshu@123");
  }
);

test(" Verify change log Page data ", async ({ page }) => {
  const changelog = new Changelogdetail(page);
  await changelog.changelogelements();
});

test(" Verify change log public view ", async ({ page }) => {
  const view = new viewpublic(page);
  await view.viewdetails();
});
