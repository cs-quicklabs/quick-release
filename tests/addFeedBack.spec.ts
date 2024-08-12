import { LoginPage } from "../e2e/Login";
import { feedback } from "../e2e/addFeedback";
import { validCredentials } from "../e2e/testData/credential";
import { test, expect } from "@playwright/test";

test.beforeEach("verify user able to add release tags", async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto("/");
  await login.login(validCredentials.mail, validCredentials.password);
});

test("verify user able to Add Tags ", async ({ page }) => {
  const feedbacks = new feedback(page);
  await feedbacks.navigateToTeamSetting();
  await feedbacks.addFeedback()
});
test("verify user able to edit Tags ", async ({ page }) => {
    const feedbacks = new feedback(page);
    await feedbacks.navigateToTeamSetting();
    await feedbacks.editFeedback()
  });