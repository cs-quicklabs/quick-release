import { test, expect } from "@playwright/test";


test.beforeEach(" Verify user able Log in with valid credential", async ({ page }) => {
  await page.goto("http://localhost:3000/allLogs");
  await page
    .getByPlaceholder("name@company.com")
    .fill("divanshu@crownstack.com");
  const passwordInput = page.locator('input[name="password"]');

 
  await passwordInput.fill("pass1234");
  // await passwordInput.fill('pass1234');
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("http://localhost:3000/allLogs")

  await page.waitForTimeout(5000);

 
});
test(" Verify Admin able to create Projet", async ({ page }) => {
    await page.getByText("Open user menu").click()
    await page.getByText("Add new project").click()
    const projectInput = page.locator('#company-website');
    await projectInput.click();
    await projectInput.fill('testproject');

  await expect(projectInput).toHaveValue('testproject');
  await page.getByText('Save').click()

    
  
    await page.waitForTimeout(5000);
  
    // Expect a title "to contain" a substring.
    // await expect(page).toHaveTitle(/Playwright/);
  });
  test(" Verify Admin should not able to create project with only spaces", async ({ page }) => {
    await page.getByText("Open user menu").click()
    await page.getByText("Add new project").click()
  const projectInput = page.locator('#company-website');

  await projectInput.click();
  await projectInput.fill('   ');

  await page.getByText('Save').click()
  await expect(
    page.locator("#email-error")
  ).toHaveText("Required");

    
  
    await page.waitForTimeout(5000);
  
  });
  