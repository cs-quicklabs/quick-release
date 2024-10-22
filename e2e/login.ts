const { test, expect } = require("@playwright/test");
export class LoginPage {
  page: any;
  emailInput: any;
  passwordInput: any;
  loginButton: any;
  loginError: any;

  constructor(page: any) {
    this.page = page;
    this.emailInput = 'input[id="email"]';
    this.passwordInput = 'input[id="password"]';
    this.loginButton = "#login";
    this.loginError = "#login-error";
  }

  async fillEmail(email: string) {
    const emailField = this.page.locator(this.emailInput);
    await emailField.fill(email);
  }

  async fillPassword(password: string) {
    const passwordField = this.page.locator(this.passwordInput);
    await passwordField.fill(password);
  }

  async clickLogin() {
    await this.page.locator(this.loginButton).click();
  }

  async waitForURL(url: string) {
    await this.page.waitForURL(url);
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async loginWithWhiteSpaces() {
    await this.fillEmail("   ");
    await this.fillPassword("   ");
    await this.clickLogin();
    await expect(this.page.locator(this.loginError)).toHaveText("Required");
  }

  async loginWithInvalidMail() {
    await this.fillEmail("    ");
    await this.fillPassword("pass1234");
    await this.clickLogin();
    await expect(this.page.locator(this.loginError)).toHaveText("Required");

    await this.page.locator(this.emailInput).press("Backspace");
    await this.page.locator(this.emailInput).fill("aa@@");
    await expect(this.page.locator(this.loginError)).toHaveText(
      "Invalid email address"
    );
  }

  async loginWithInvalidCredential(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    await expect(this.page.locator(".Toastify")).toHaveText(
      "Incorrect Credentials!"
    );
  }
  async loginWithEmptyValue() {
    await this.fillEmail("");
    await this.fillPassword("");
    await this.clickLogin();
    await expect(this.page.locator(this.loginError)).toHaveText("Required");
  }
};
