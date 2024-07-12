import { LoginPage } from "../e2e/Login";
import { releaseTags } from "../e2e/Releasetag";
import { test, expect } from "@playwright/test";

test("verify user able to add release tags", async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 300000);
  const login = new LoginPage(page);
  await page.goto("/");
  await login.login("divanshu@crownstack.com", "pass1234");
  const releasetag = new releaseTags(page);
  await releasetag.releaseTag();
});
