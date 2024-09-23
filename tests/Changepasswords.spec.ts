import { changePassword } from "@/e2e/changePassword";
import { LoginPage } from "@/e2e/login.js";
import { validCredentials } from "@/e2e/testData/credential";
import { test, expect } from "@playwright/test";

test.beforeEach(" Verify Admin able login ", async ({ page }) => {
  const login = new LoginPage(page); 
  await page.goto("/");

  await login.login(validCredentials.mail, validCredentials.password);
});

test("verify user able to  change password settings ", async ({ page }) => {
  const password = new changePassword(page);
  await password.changePassword("Divanshu@123", "Divanshu@1234");
});
