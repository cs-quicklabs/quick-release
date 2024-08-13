const { test, expect } = require("@playwright/test");

exports.Signup = class Signup {
  constructor(page) {
    this.page = page;
    this.signUpButton = this.page.getByText("Sign up");
    this.firstNameInput = this.page.locator("#first-name");
    this.lastNameInput = this.page.locator("#last-name");
    this.emailInput = this.page.locator("#email");
    this.companyInput = this.page.locator("#organisation-name");
    this.passwordInput = this.page.locator('input[id="password"]').first();
    this.confirmPasswordInput = this.page.locator('input[name="confirmPassword"]');
    this.termsCheckbox = this.page.getByRole("checkbox", { name: "terms" });
    this.createAccountButton = this.page.getByText("Create an account");
    this.toastMessage = this.page.locator(".Toastify");
    this.loginEmailInput = 'input[id="email"]';
    this.loginPasswordInput = 'input[id="password"]';
    this.loginButton = "#login";
    this.loginError = "#login-error";
  }

  async navigateToSignUp() {
    await this.signUpButton.click();
  }

  generateRandomEmail() {
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return `user${numeric}@yopmail.com`;
  }

  async fillSignupForm(firstName, lastName, email, company, password, confirmPassword) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.companyInput.fill(company);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.termsCheckbox.check();
  }

  async submitForm() {
    await this.createAccountButton.click();
  }

  async verifyToastMessage(expectedMessage) {
    await expect(this.toastMessage).toHaveText(expectedMessage);
  }

  async verifyUser(email,password) {
    await this.page.goto('https://www.yopmail.com/en/');
    
    await this.page.fill('input#login', email);
    await this.page.click('button[title="Check Inbox @yopmail.com"]');

    await this.page.waitForSelector('iframe#ifinbox', { timeout: 30000 });
    const inboxFrame = await this.page.frame({ name: 'ifinbox' });

    await inboxFrame.waitForSelector('div.m', { timeout: 30000 });
    await inboxFrame.click('div.m');

    await this.page.waitForSelector('iframe#ifmail', { timeout: 30000 });
    const emailFrame = await this.page.frame({ name: 'ifmail' });
    await emailFrame.waitForSelector('a:has-text("Click to verify Account")', { timeout: 30000 });
    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      emailFrame.click('a:has-text("Click to verify Account")')
    ]);
    await newPage.locator("#email").click()
    await newPage.locator("#email").fill(email)
    await newPage.locator(this.loginPasswordInput).fill(password)
    await newPage.locator(this.loginButton).click();

    
  }
  async login(email,password) {
    await this.page.locator("#email").fill(email)
    await this.page.locator(this.loginPasswordInput).fill(password)
    await this.page.locator(this.loginButton).click();

    
  }
 


};
