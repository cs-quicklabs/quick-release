import { test, expect } from "@playwright/test";

test.beforeEach(" Verify Admin able login ", async ({ page }) => {
  await page.goto("http://localhost:3000/allLogs");
  await page
    .getByPlaceholder("name@company.com")
    .fill("divanshu@crownstack.com");
  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.fill("pass1234");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("http://localhost:3000/allLogs");
});

test("verify user able to click on change password settings ", async ({
  page,
}) => {
  await page.getByText("Open user menu").click();
  await page.getByText("Profile Settings").click();
  await expect(page.getByText("Profile")).toBeVisible();
  await page.getByText("Change Password").click();
  await page.locator("input[name='oldPassword']").fill("pass1234");
  await page.locator("input[name='password']").fill("pass12345");
  await page.locator("input[name='confirmPassword']").fill("pass12345");
  await page.getByText('Save').click()
});
