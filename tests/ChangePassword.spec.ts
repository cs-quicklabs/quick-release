import { LoginPage } from "../e2e/Login";
import { Changepassword } from "../e2e/changepassword";
import { test, expect } from "@playwright/test";

test.beforeEach(" Verify Admin able login ", async ({ page }) => {
  const login = new LoginPage(page); // 30 seconds
  await login.gotoLoginPage();
  await login.login("divanshu@crownstack.com", "pass1234");
});

test("verify user able to click on change password settings ", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);

  const changepass = new Changepassword(page);
  await changepass.changepassword();
});
