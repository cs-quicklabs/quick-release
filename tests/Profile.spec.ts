import { LoginPage } from "../e2e/Login";
import { Profiles } from "../e2e/Profiles";
import { test, expect } from "@playwright/test";

test.beforeEach(" Verify Admin able login ", async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.login("divanshu@crownstack.com", "Divanshu@123");
});

test("should update profile", async ({ page }) => {
  const profiles = new Profiles(page);
  await profiles.updateProfile("John", "Doe");
});

test("should upload profile avatar", async ({ page }) => {
  const profiles = new Profiles(page);
  await profiles.uploadProfileAvatar(
    "C:/Users/Admin/OneDrive/Pictures/Screenshots/Test.png"
  );
});

test("should verify profile page elements", async ({ page }) => {
  const profiles = new Profiles(page);
  await profiles.openUserMenuAndNavigateToSettings();
  await profiles.verifyProfilePageElements();
});
