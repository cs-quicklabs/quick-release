const { test, expect } = require("@playwright/test");
const { validCredentials } = require("./testData/credential");
exports.forgotPassword = class ForgotPassword {
  constructor(page) {
    this.page=page;
    this.forgotPasswordLink =this.page.locator("#forget-password");
    this.emailInput = 'input[id="email"]';
    this.recaptcha=".recaptcha-checkbox-border";
   
  }

  async clickForgotPassword(){
   await this.forgotPasswordLink.click()
   await expect(this.page.locator("text=Forgot your password?")).toBeVisible()
  
}
async fillEmail(email) {
  const emailField = this.page.locator(this.emailInput);
  await emailField.fill(email);
  await this.page.getByText("Request Password Reset Instructions").click()
}

async setPassword(email) {
  await this.page.goto('https://www.yopmail.com/en/');
  
  await this.page.fill('input#login', email);
  await this.page.click('button[title="Check Inbox @yopmail.com"]');
  
  
  const page1Promise = this.page.waitForEvent('popup');
  

  await this.page.frameLocator('iframe[name="ifmail"]').getByRole('link', { name: 'Change my password' }).click(); 
  const page1 = await page1Promise;
  await page1.locator("#password").click()
  await page1.locator("#password").fill("Divanshu@123")
  await page1.locator("#confirm-password").fill("Divanshu@123")
  await page1.getByText("Set Password").click()
}
}