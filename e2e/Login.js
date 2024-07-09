const { test, expect } = require("@playwright/test");
exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.passwordInput = 'input[id="password"]';
    this.submit = '"button", { name: "Log in" }';
    this.emailInput = "input[id=email]";
  }

  async login(email, password) {
    const emailField = this.page.locator(this.emailInput);
    await emailField.fill(email);
    const passwordField = this.page.locator(this.passwordInput);

    await passwordField.fill(password);
    await this.page.getByRole("button", { name: "Log in" }).click();

    await this.page.waitForURL("http://localhost:3000/allLogs");
  }

  async loginWithWhiteSpaces() {
    const emailField = this.page.locator(this.emailInput);
    await emailField.fill("   ");
    const passwordField = this.page.locator(this.passwordInput);

    await passwordField.fill("  ");
    await this.page.getByRole("button", { name: "Log in" }).click();
    await expect(this.page.locator("#login-error")).toHaveText("Required");
  }

  async loginWithInvalidMail() {
    const emailField = this.page.locator(this.emailInput);
    await emailField.fill("    ");
    const passwordField = this.page.locator(this.passwordInput);

    await passwordField.fill("pass1234");
    await this.page.getByRole("button", { name: "Log in" }).click();
    await expect(this.page.locator("#login-error")).toHaveText("Required");

    await this.page.locator(this.emailInput).press("Backspace");
    await this.page.locator(this.emailInput).fill("aa@@");
    await expect(this.page.locator("#login-error")).toHaveText(
      "Invalid email address"
    );
  }

  async loginWithInvalidCredential(email, password) {
    const emailField = this.page.locator(this.emailInput);
    await emailField.fill(email);
    const passwordField = this.page.locator(this.passwordInput);

    await passwordField.fill(password);
    await this.page.getByRole("button", { name: "Log in" }).click();
    await expect(this.page.locator(".Toastify")).toHaveText(
      "Incorrect Credentials!"
    );
  }
};
