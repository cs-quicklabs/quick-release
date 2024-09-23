import { LoginPage } from "../e2e/login";
import { releaseTags } from "../e2e/releaseTag";
import { validCredentials } from "../e2e/testData/credential";
import { test, expect } from "@playwright/test";

test.beforeEach("verify user able to add release tags", async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.login(validCredentials.mail, validCredentials.password);
});

test("verify user able to Add Tags ", async ({ page }) => {
  const releasetag = new releaseTags(page);
  await releasetag.createReleaseTag();
});




test("verify user able to Delete Tags", async ({ page }) => {
  const deletereleasetag = new releaseTags(page);
  await deletereleasetag.deleteReleaseTag();
});

test("verify user should not able to add Tags with emptyvalue", async ({ page }) => {
  const addTagsOnlySpaces = new releaseTags(page);
  await addTagsOnlySpaces.createReleaseTagEmptyValue();
});
