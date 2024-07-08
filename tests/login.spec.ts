import { LoginPage } from "../e2e/Login";
import { test, expect } from "@playwright/test";

test("Verify user able to login with valid credential", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 30000);
  const login = new LoginPage(page); // 30 seconds
  // await login.gotoLoginPage();
  await page.goto("/");
  await login.login("divanshu@crownstack.com", "pass1234");
});

test(" verify Username and Password field  with only spaces", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const login = new LoginPage(page);
  await page.goto("/");
  await login.loginwithwhitespaces();
});

test("Verify username field by invalid email", async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 30000);

  const login = new LoginPage(page);
  await page.goto("/");
  await login.loginwithInvalidmail();
});

test("Verify username field by invalid credential", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const login = new LoginPage(page);
  await page.goto("/");
  await login.loginwithInvalidcredential("divanshu@crownstack.com", "pass123");
});
