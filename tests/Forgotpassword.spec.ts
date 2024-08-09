import {ForgotPassword} from "../e2e/forgot-password";
import { test, expect } from "@playwright/test";


test("Verify user able reset password", async ({ page }) => {
    await page.goto("/");
      const email = `soap-steel@ef6rs3pi.mailosaur.net`;
      const forgotPassword = new ForgotPassword(page);
    
      // Step 1: Trigger the password reset email
      await forgotPassword.clickForgotPassword();
      await forgotPassword.fillEmail(email);
    
      // Step 2: Get the reset link from Mailosaur
      await forgotPassword.refreshMail()
      const resetLink = await forgotPassword.getResetLink();
      console.log('Reset Link:', resetLink);
    
      // Step 3: Reset the password using the link

      await forgotPassword.resetPassword(resetLink);
      await forgotPassword.refreshMail()
    
      // Step 4: Verify the password reset was successful
      await expect(page.locator('text=Password reset successful')).toBeVisible();
    });
