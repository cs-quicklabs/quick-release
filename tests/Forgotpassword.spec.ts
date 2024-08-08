import {forgotPassword} from "../e2e/forgot-password";
import { test, expect } from "@playwright/test";
import { validCredentials } from "../e2e/testData/credential";


test("Verify user able reset password", async ({ page }) => {
    await page.goto("/");
    const forgotPasswords= new forgotPassword(page)
    await forgotPasswords.clickForgotPassword()
    const email=validCredentials.mail
    await forgotPasswords.fillEmail(email)
    await forgotPasswords.setPassword(email)
  });