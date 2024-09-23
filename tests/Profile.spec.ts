import { LoginPage } from "@/e2e/login";
import { Profiles } from "@/e2e/profiles";
import { validCredentials } from "@/e2e/testData/credential";
import {ImagePaths} from "@/e2e/testData/ImagePath";
import { test, expect } from "@playwright/test";

test.beforeEach(" Verify Admin able login ", async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.login(validCredentials.mail, validCredentials.password);
});

test("should update profile", async ({ page }) => {
  const profiles = new Profiles(page);
  await profiles.updateProfile();
});

test("should upload profile avatar", async ({ page }) => {
  const profiles = new Profiles(page);
  await profiles.uploadProfileAvatar(
  ImagePaths.path
  );
});

test("should verify profile page elements", async ({ page }) => {
  const profiles = new Profiles(page);
  await profiles.openUserMenuAndNavigateToSettings();
  await profiles.verifyProfilePageElements();
});
