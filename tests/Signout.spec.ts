import { test, expect } from "@playwright/test";
test.beforeEach(" Verify Admin able login ", async({ page }) => {
    await page.goto("http://localhost:3000/allLogs");
    await page
      .getByPlaceholder("name@company.com")
      .fill("divanshu@crownstack.com");
    const passwordInput = page.locator('input[name="password"]');
  
    // Perform actions on the input field
    await passwordInput.fill("pass1234");
    // await passwordInput.fill('pass1234');
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForURL("http://localhost:3000/allLogs")
})
test('verify user able to click on cancel Signout popup ',async({page})=>{
    await page.getByText('Open user menu').click()
    await page.getByText('Sign out').click()
    await page.getByRole("button", { name: "No, cancel"}).click();


})

test('verify user able to  signout ',async({page})=>{
    await page.getByText('Open user menu').click()
    await page.getByText('Sign out').click()
    await page.getByRole("button", { name: "Yes, I'm sure"}).click();


})

