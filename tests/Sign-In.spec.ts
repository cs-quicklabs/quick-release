import { test, expect } from "@playwright/test";

test(" Verify user able Sign in with valid credential", async ({ page }) => {
  await page.goto("http://localhost:3000/allLogs");
  await page
    .getByPlaceholder("name@company.com")
    .fill("divanshu@crownstack.com");
  const passwordInput = page.locator('input[name="password"]');

 
  await passwordInput.fill("pass1234");
  // await passwordInput.fill('pass1234');
  await page.getByRole("button", { name: "Log in" }).click();

  await page.waitForTimeout(5000);

 
});




test(" verify Username and Password field  with only spaces", async ({ page }) => {
  await page.goto("http://localhost:3000/allLogs");
  await page.getByPlaceholder("name@company.com").fill("      ");
  const passwordInput = page.locator('input[name="password"]');

  await passwordInput.fill("         ");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(
    page.locator("//div/div/form/div/ span[@class='text-red-600 text-[12px]']")
  ).toHaveText("Required");

  await page.waitForTimeout(5000);



  
});


test("Verify username field by invalid email", async ({ page }) => {
  await page.goto("http://localhost:3000/allLogs");
  await page.getByPlaceholder("name@company.com").fill("      ");
  const passwordInput = page.locator('input[name="password"]');

  await passwordInput.fill("         ");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(
    page.locator("//div/div/form/div/ span[@class='text-red-600 text-[12px]']")
  ).toHaveText("Required");

  await page.getByPlaceholder("name@company.com").fill(" aa@@yopmail.com  ");
  await expect(
    page.locator("//div/div/form/div/ span[@class='text-red-600 text-[12px]']")
  ).toHaveText("Invalid email address");

  await page.waitForTimeout(5000);


});


test("Verify signin with invalid credential", async ({ page }) => {
  await page.goto("http://localhost:3000/allLogs");
  await page.getByPlaceholder("name@company.com").fill("divanshu@crownstack.com");
  const passwordInput = page.locator('input[name="password"]');

  await passwordInput.fill("pass123");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(
    page.locator("//div[contains(text(),'Incorrect Credentials!')]")
  ).toHaveText("Incorrect Credentials!");

  await page.waitForTimeout(5000);


});
