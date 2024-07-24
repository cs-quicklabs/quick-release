import { LoginPage } from "../e2e/Login";
import { Signup } from "../e2e/Signup";
import { test, expect } from "@playwright/test";

test("verify user able to  signup", async ({ page, browser }) => {
  await page.goto("/");
  const signupPage = new Signup(page);


  await signupPage.navigateToSignUp();
  const uniqueEmail = await signupPage.generateRandomEmail();


  await signupPage.fillSignupForm(
    "John",
    "Doe",
    uniqueEmail,
    "ExampleCorp",
    "password123",
    "password123"
  );


  await signupPage.submitForm();


  await signupPage.verifyToastMessage("User registered successfully");
});
