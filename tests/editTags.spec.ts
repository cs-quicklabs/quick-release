import { LoginPage } from "@/e2e/login.js";
import { releaseTags } from "@/e2e/releaseTag";
import { validCredentials } from "@/e2e/testData/credential";
import { test, expect } from "@playwright/test";

test.beforeEach("verify user able to add release tags", async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.login(validCredentials.mail, validCredentials.password);
});

test("verify user able to edit Tags ", async ({ page }) => {
    const releasetag = new releaseTags(page);
    await releasetag.editReleaseTag();
  });