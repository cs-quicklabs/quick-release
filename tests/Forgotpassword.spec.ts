import { ForgotPassword } from "@/e2e/forgotPassword";
import { test } from "@playwright/test";

test("Verify user able reset password", async ({ page }) => {
  await page.goto("/");
  const email = `jitender@yopmail.com`;
  const forgotPassword = new ForgotPassword(page);

  await forgotPassword.clickForgotPassword();
  await forgotPassword.fillEmail(email);

  await forgotPassword.createPassword(email, "password123");
});
