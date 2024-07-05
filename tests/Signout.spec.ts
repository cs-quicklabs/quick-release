import { LoginPage } from "../e2e/Login";
import { Signout } from "../e2e/Signout";
import { test, expect } from "@playwright/test";

test("verify user able to  signout ", async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const login = new LoginPage(page); // 30 second
  //   await login.gotoLoginPage();
  await page.goto("/");
  await login.login("divanshu@crownstack.com", "pass1234");
  const signout = new Signout(page); // 30 seconds
  await signout.logout();
});
