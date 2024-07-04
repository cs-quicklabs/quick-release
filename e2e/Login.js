const { test, expect } = require("@playwright/test");
exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.input = 'input[name="password"]';
    this.submit = '"button", { name: "Log in" }';
  }

  async gotoLoginPage() {
    await this.page.goto("http://localhost:3000/");
  }

  async login(email, password) {
    await this.page.getByPlaceholder("name@company.com").fill(email);
    const passwordInput = this.page.locator(this.input);

    await passwordInput.fill(password);
    // await passwordInput.fill('pass1234');
    await this.page.getByRole("button", { name: "Log in" }).click();

    await this.page.waitForTimeout(5000);
    await this.page.waitForURL("http://localhost:3000/allLogs");
  }

  async loginwithwhitespaces(email, password) {
    await this.page.getByPlaceholder("name@company.com").fill(email);
    const passwordInput = this.page.locator('input[name="password"]');

    await passwordInput.fill(password);
    await this.page.getByRole("button", { name: "Log in" }).click();
    await expect(
      this.page.locator(
        "//div/div/form/div/ span[@class='text-red-600 text-[12px]']"
      )
    ).toHaveText("Required");

    await this.page.waitForTimeout(5000);
  }

  async loginwithInvalidmail() {
    await this.page.getByPlaceholder("name@company.com").fill("      ");
    const passwordInput = this.page.locator(this.input);

    await passwordInput.fill("         ");
    await this.page.getByRole("button", { name: "Log in" }).click();
    await expect(
      this.page.locator(
        "//div/div/form/div/ span[@class='text-red-600 text-[12px]']"
      )
    ).toHaveText("Required");
    await this.page.getByPlaceholder("name@company.com").press("Backspace");
    await this.page.getByPlaceholder("name@company.com").fill("aa@@");
    await expect(
      this.page.locator(
        "//div/div/form/div/ span[@class='text-red-600 text-[12px]']"
      )
    ).toHaveText("Invalid email address");

    await this.page.waitForTimeout(5000);
  }

  async loginwithInvalidcredential(email, password) {
    await this.page.getByPlaceholder("name@company.com").fill(email);
    const passwordInput = this.page.locator(this.input);

    await passwordInput.fill(password);
    await this.page.getByRole("button", { name: "Log in" }).click();
    await this.page.waitForTimeout(5000);
    await expect(this.page.locator("//div[@class='Toastify']")).toHaveText(
      "Incorrect Credentials!"
    );

    await this.page.waitForTimeout(5000);
  }
};
