import { LoginPage } from "../e2e/Login";
import { Profiles } from "../e2e/Profiles";
import { test, expect } from "@playwright/test";

test.beforeEach(" Verify Admin able login ", async ({ page }) => {
  const login = new LoginPage(page); // 30 seconds
  await login.gotoLoginPage();
  await login.login("divanshu@crownstack.com", "pass1234");
});

test("verify user able to click on profile settings ", async ({ page }) => {
  const Profile = new Profiles(page); // 30 seconds
  await Profile.profileclick();
});

test("verify Profile page Elements ", async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const Profile = new Profiles(page); // 30 seconds
  await Profile.profilepage();
});

test("verify user able to update profile ", async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const Profile = new Profiles(page); // 30 seconds
  await Profile.profileupdate("Kathleen1", "Gupta");
});

test("verify user able to uploadfile ", async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const Profile = new Profiles(page); // 30 seconds
  await Profile.profileupload();
});
