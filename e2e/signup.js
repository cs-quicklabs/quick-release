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
    this.confirmPasswordInput = this.page.locator(
      'input[name="confirmPassword"]'
    );
    this.termsCheckbox = this.page.getByRole("checkbox", { name: "terms" });
    this.createAccountButton = this.page.getByText("Create an account");
    this.toastMessage = this.page.locator(".Toastify");
  }

  async navigateToSignUp() {
    await this.signUpButton.click();
  }
  async generateRandomEmail() {
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    return `user${numeric}@example.com`;
  }

  async fillSignupForm(
    firstName,
    lastName,
    email,
    company,
    password,
    confirmPassword
  ) {
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
};
