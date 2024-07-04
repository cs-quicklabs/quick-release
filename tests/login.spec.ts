import { LoginPage } from "../Pages/Login";
import { test, expect } from "@playwright/test";

test("Verify user able to login with valid credential", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const login = new LoginPage(page); // 30 seconds
  await login.gotoLoginPage();
  await login.login("divanshu@crownstack.com", "pass1234");
});

test(" verify Username and Password field  with only spaces", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const login = new LoginPage(page); // 30 seconds
  await login.gotoLoginPage();
  await login.loginwithwhitespaces("  ", "  ");
});

test("Verify username field by invalid email", async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const login = new LoginPage(page); // 30 seconds
  await login.gotoLoginPage();
  await login.loginwithInvalidmail();
});

test("Verify username field by invalid credential", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const login = new LoginPage(page); // 30 seconds
  await login.gotoLoginPage();
  await login.loginwithInvalidcredential("divanshu@crownstack.com", "pass123");
});
