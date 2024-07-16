import { LoginPage } from "../e2e/Login";
import { Signout } from "../e2e/Signout";
import { validCredentials } from "../e2e/testData/credential";
import { test, expect } from "@playwright/test";

test("verify user able to  signout ", async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const login = new LoginPage(page);
  await page.goto("/");
  await login.login(validCredentials.mail, validCredentials.password);
  const signout = new Signout(page);
  await signout.logout();
});
