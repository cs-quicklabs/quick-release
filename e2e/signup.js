const { test, expect } = require('@playwright/test');
exports.Signup = class Signup{
    constructor(page){
    this.page=page;
    

}

async signup(firstname,lastname,email,company,password,confirmPassword){
  await this.page.getByText('Sign up').click()
  await this.page.getByPlaceholder('First name').fill(firstname)
  await this.page.getByPlaceholder('Last name').fill(lastname)
  await this.page.getByPlaceholder('name@company.com').fill(email)
  await this.page.getByPlaceholder('Company name').fill(company)
  await this.page.locator('input[id="password"]').first().fill(password)
  await this.page.locator('input[name="confirmPassword"]').fill(confirmPassword)
  await this.page.getByRole('checkbox', { name: 'terms' }).check();
  await this.page.getByText("Create an account").click()
  
   
  };
}