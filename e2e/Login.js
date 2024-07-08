const { test, expect } = require("@playwright/test");
exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.passwordinput = 'input[id="password"]';
    this.submit = '"button", { name: "Log in" }';
    this.emailinput = "input[id=email]";
  }

  async gotoLoginPage() {
    await this.page.goto("http://localhost:3000/");
  }

  async login(email, password) {
    const emailfield = this.page.locator(this.emailinput);
    await emailfield.fill(email);
    const passwordfield = this.page.locator(this.passwordinput);

    await passwordfield.fill(password);
    await this.page.getByRole("button", { name: "Log in" }).click();

    await this.page.waitForURL("http://localhost:3000/allLogs");
  }

  async loginwithwhitespaces() {
    const emailfield = this.page.locator(this.emailinput);
    await emailfield.fill("   ");
    const passwordfield = this.page.locator(this.passwordinput);

    await passwordfield.fill("  ");
    await this.page.getByRole("button", { name: "Log in" }).click();
    await expect(this.page.locator("#login-error")).toHaveText("Required");
  }

  async loginwithInvalidmail() {
    const emailfield = this.page.locator(this.emailinput);
    await emailfield.fill("    ");
    const passwordfield = this.page.locator(this.passwordinput);

    await passwordfield.fill("pass1234");
    await this.page.getByRole("button", { name: "Log in" }).click();
    await expect(this.page.locator("#login-error")).toHaveText("Required");

    await this.page.locator(this.emailinput).press("Backspace");
    await this.page.locator(this.emailinput).fill("aa@@");
    await expect(this.page.locator("#login-error")).toHaveText(
      "Invalid email address"
    );
  }

  async loginwithInvalidcredential(email, password) {
    const emailfield = this.page.locator(this.emailinput);
    await emailfield.fill(email);
    const passwordfield = this.page.locator(this.passwordinput);

    await passwordfield.fill(password);
    await this.page.getByRole("button", { name: "Log in" }).click();
    await expect(this.page.locator(".Toastify")).toHaveText(
      "Incorrect Credentials!"
    );
  }
};
