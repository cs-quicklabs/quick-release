import { LoginPage } from "@/e2e/login.js";
import { validCredentials } from "@/e2e/testData/credential";
import { test, expect } from "@playwright/test";

test("Verify user able to login with valid credential", async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.login(validCredentials.mail, validCredentials.password);
});

test(" verify Username and Password field  with only spaces", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.loginWithWhiteSpaces();
});
test(" verify Username and Password field by passing empty value", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.loginWithEmptyValue();
});

test("Verify username field by invalid email", async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.loginWithInvalidMail();
});

test("Verify username field by invalid credential", async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.loginWithInvalidCredential("divanshu@crownstack.com", "pass123");
});
