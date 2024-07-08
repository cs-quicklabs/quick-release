import { LoginPage } from "../e2e/Login";
import { Signup } from "../e2e/signup";
import { test, expect } from "@playwright/test";

test("verify user able to  signout ", async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto("/");
  const signup = new Signup(page);
  await signup.signup(
    "Divanshu",
    "Gupta",
    "divanshu@yopmail.com",
    "crownstack",
    "pass123",
    "pass123"
  );
});
