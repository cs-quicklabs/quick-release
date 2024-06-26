import { test, expect } from "@playwright/test";

test(" Verify user able Sign up in with valid data", async ({ page }) => {
  await page.goto("http://localhost:3000/allLogs");
  await page.getByText('Sign up').click()
  await page.getByPlaceholder('First name').fill("Divanshu")
  await page.getByPlaceholder('Last name').fill("Gupta")
  await page.getByPlaceholder('name@company.com').fill("divanshu@yopmail.com")
  await page.getByPlaceholder('Company name').fill("crownstack")
  await page.locator('input[id="password"]').first().fill('pass123')
  await page.locator('input[name="confirmPassword"]').fill('pass123')
  await page.getByRole('checkbox', { name: 'terms' }).check();
  await page.getByText("Create an account").click()


 
});
