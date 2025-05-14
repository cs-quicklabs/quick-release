import { Signup } from "@/e2e/signup";
import { test } from "@playwright/test";

test("verify user able to register account", async ({ page }) => {
  await page.goto("/");
  const signupPage = new Signup(page);

  await signupPage.navigateToSignUp();
  const uniqueEmail = signupPage.generateRandomEmail();

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
  await page.goto("https://yopmail.com/en/");
  await signupPage.verifyUser(uniqueEmail, "password123");
});

test("verify user able to resend link to register", async ({ page }) => {
  await page.goto("/");
  const signupPage = new Signup(page);

  await signupPage.navigateToSignUp();
  const uniqueEmail = signupPage.generateRandomEmail();

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
  await signupPage.login(uniqueEmail, "password123");
});
