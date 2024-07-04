import { LoginPage } from "../e2e/Login";
import { Changelogdetail } from "../e2e/changelogpage";
import { viewpublic } from "../e2e/viewpublic";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on newchange log ",
  async ({ page }) => {
    const login = new LoginPage(page); // 30 seconds
    await login.gotoLoginPage();
    await login.login("divanshu@crownstack.com", "pass1234");
  }
);

test(" Verify change log Page data ", async ({ page }) => {
  const changelog = new Changelogdetail(page);
  await changelog.changelogelements();
});

test(" Verify change log public view ", async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);

  const view = new viewpublic(page);
  await view.viewdetails();
});