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

test('verify user able to click on profile settings ',async({page})=>{
    await page.getByText('Open user menu').click()
    await page.getByText('Profile Settings').click()
    await expect(page.getByText('Profile')).toBeVisible()
})

test('verify all elements on Profile setting Page',async({page})=>{
    await page.getByText('Open user menu').click()
    await page.getByText('Profile Settings').click()
    await expect(page.getByText('Profile Settings')).toBeVisible()
    await expect(page.getByText('Upload Avatar')).toBeVisible()
    await expect(page.getByText('First Name')).toBeVisible()
    await expect(page.getByText('Last Name')).toBeVisible()
    await expect(page.getByText('Email', { exact: true })).toBeVisible()
})


test('verify Update profile',async({page})=>{
    await page.getByText('Open user menu').click()
    await page.getByText('Profile Settings').click()
    await page.locator('input[name="firstName"]').click()
    await page.locator('input[name="firstName"]').press('Backspace')
    await page.locator('input[name="firstName"]').fill('Kathleen1')
    await page.locator('input[name="lastName"]').click()
    await page.locator('input[name="lastName"]').press('Backspace')
    await page.locator('input[name="lastName"]').fill('Gupta')
    await page.getByText('Save').click()
})
