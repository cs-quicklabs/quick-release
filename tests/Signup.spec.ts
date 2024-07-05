import { LoginPage } from "../e2e/Login";
import { Signup } from "../e2e/signup";
import { test, expect } from "@playwright/test";

test("verify user able to  signout ", async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const login = new LoginPage(page); // 30 seconds
  // await login.gotoLoginPage();
  await page.goto("/");
  const signup = new Signup(page); // 30 seconds
  await signup.signup(
    "Divanshu",
    "Gupta",
    "divanshu@yopmail.com",
    "crownstack",
    "pass123",
    "pass123"
  );
});
