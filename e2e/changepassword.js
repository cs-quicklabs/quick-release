const { test, expect } = require('@playwright/test');
exports.Changepassword = class Changepassword{
    constructor(page){
    this.page=page;

}

async changepassword(){
   
    await this.page.getByText("Open user menu").click();
    await this.page.getByText("Profile Settings").click();
    await expect(this.page.getByText("Profile")).toBeVisible();
    await this.page.getByText("Change Password").click();
    await this.page.locator("input[name='oldPassword']").fill("pass1234");
    await this.page.locator("input[name='password']").fill("pass12345");
    await this.page.locator("input[name='confirmPassword']").fill("pass12345");
    await this.page.getByText('Save').click()
   
  };
}