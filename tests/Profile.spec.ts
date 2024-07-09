import { LoginPage } from "../e2e/Login";
import { Profiles } from "../e2e/Profiles";
import { test, expect } from "@playwright/test";

test.beforeEach(" Verify Admin able login ", async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.login("divanshu@crownstack.com", "Divanshu@123");
});

test("verify user able to click on profile settings ", async ({ page }) => {
  const Profile = new Profiles(page);
  await Profile.profileClick();
});

test("verify Profile page Elements ", async ({ page }) => {
  const Profile = new Profiles(page);
  await Profile.profilePage();
});

test("verify user able to update profile ", async ({ page }) => {
  const Profile = new Profiles(page); // 30 seconds
  await Profile.profileUpdate("Kathleen1", "Gupta");
});

test("verify user able to uploadfile ", async ({ page }) => {
  const Profile = new Profiles(page);
  await Profile.profileUpload();
});
