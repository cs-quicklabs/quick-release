import { LoginPage } from "../e2e/Login";
import { Signup } from "../e2e/Signup";
import { test, expect } from "@playwright/test";

test("verify user able to  signup", async ({ page, browser }) => {
  await page.goto("/");
  const signupPage = new Signup(page);

  // Navigate to the signup form
  await signupPage.navigateToSignUp();
  const uniqueEmail = await signupPage.generateRandomEmail();

  // Fill out the signup for
  await signupPage.fillSignupForm(
    "John",
    "Doe",
    uniqueEmail,
    "ExampleCorp",
    "password123",
    "password123"
  );

  // Submit the form
  await signupPage.submitForm();

  // Verify the toast message
  await signupPage.verifyToastMessage("User registered successfully");
});
