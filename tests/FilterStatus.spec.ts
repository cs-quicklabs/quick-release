import { LoginPage } from "../e2e/login.js";
import { Filterstatus } from "../e2e/filterByStatus";
import { validCredentials } from "../e2e/testData/credential";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on newchangelog ",
  async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto("/");
    await page.waitForLoadState('load')
    await login.login(validCredentials.mail, validCredentials.password);
  }
);

test(" Verify user able to filter Publish status", async ({ page }) => {
    const filter = new Filterstatus(page);
    await filter.filterPublish();
  });
  test(" Verify user able to filter draft status", async ({ page }) => {
    const filter = new Filterstatus(page);
    await filter.filterSaveDraft();
  });