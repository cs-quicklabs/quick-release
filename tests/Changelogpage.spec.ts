import { test, expect } from "@playwright/test";
import { Title } from "@radix-ui/react-toast";
test.beforeEach(" Verify Admin able to click on newchange log ", async ({ page }) => {
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
    await page.locator("//button[normalize-space()='New Changelog']").click()
    

    
  
    await page.waitForTimeout(5000);
  });


  test(" Verify change log Page data ", async ({ page }) => {

    const title="Test";
    const description='Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry';
    const version='2.0';
    await page.locator('input[name="title"]').fill(title)
    await page.locator("//div[@class='ql-editor ql-blank']").fill(description)
    await page.getByPlaceholder("Enter release version").fill(version)
    await page.locator('#react-select-3-input').click()
    await page.getByText('New', { exact: true }).click();
    await page.locator('#react-select-5-input').click()
    await page.getByText('Web', { exact: true }).click();
    await page.getByText("Change published status").click()


      await expect(
        page.locator("//div[@class='ql-editor']//p[contains(text(),'Lorem Ipsum is simply dummy text of the printing a')]")
      ).toHaveText(description);





    
  
    await page.waitForTimeout(5000);
  });


  test(" Verify user able to Edit changelog", async ({ page }) => {

    const title="Test";
    const description='Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry';
    const version='2.0';
    await page.locator('input[name="title"]').fill(title)
    await page.locator("//div[@class='ql-editor ql-blank']").fill(description)
    await page.getByPlaceholder("Enter release version").fill(version)
    await page.locator('#react-select-3-input').click()
    await page.getByText('New', { exact: true }).click();
    await page.locator('#react-select-5-input').click()
    await page.getByText('Web', { exact: true }).click();
    await page.getByText("Change published status").click()
    await page.getByText("Publish Changelog Now").click()


      await expect(
        page.locator("//div[@class='ql-editor']//p[contains(text(),'Lorem Ipsum is simply dummy text of the printing a')]")
      ).toHaveText(description);
    await page.locator("(//*[name()='svg'][@name='Open options'])[1]").click()
    await page.getByText("Edit").click()
    await expect( page.getByText("Edit change log")).toBeVisible()
    await page.locator('input[name="title"]').click()
    await page.locator('input[name="title"]').press('Backspace')
    await page.locator('input[name="title"]').fill('test12')
    await page.getByText("Publish Changelog Now").click()

   
  });

  test(" Verify user able to Delete changelog", async ({ page }) => {

    const title="Test";
    const description='Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry';
    const version='2.0';
    await page.locator('input[name="title"]').fill(title)
    await page.locator("//div[@class='ql-editor ql-blank']").fill(description)
    await page.getByPlaceholder("Enter release version").fill(version)
    await page.locator('#react-select-3-input').click()
    await page.getByText('New', { exact: true }).click();
    await page.locator('#react-select-5-input').click()
    await page.getByText('Web', { exact: true }).click();
    await page.getByText("Change published status").click()
    await page.getByText("Publish Changelog Now").click()


      await expect(
        page.locator("//div[@class='ql-editor']//p[contains(text(),'Lorem Ipsum is simply dummy text of the printing a')]")
      ).toHaveText(description);
    await page.locator("(//*[name()='svg'][@name='Open options'])[1]").click()
    await page.getByText("Delete").click()
   

   
  });
