import { ForgotPassword } from "@/e2e/forgotPassword";
import { test, expect } from "@playwright/test";

test("Verify user able reset password", async ({ page }) => {
  await page.goto("/");
  const email = `soap-steel@ef6rs3pi.mailosaur.net`;
  const forgotPassword = new ForgotPassword(page);

  await forgotPassword.clickForgotPassword();
  await forgotPassword.fillEmail(email);

  await forgotPassword.refreshMail();
  const resetLink = await forgotPassword.getResetLink();

  await forgotPassword.resetPassword(resetLink);
  await forgotPassword.refreshMail();

  await expect(page.locator("text=Password reset successful")).toBeVisible();
});
