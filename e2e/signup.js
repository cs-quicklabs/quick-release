const { test, expect } = require("@playwright/test");
exports.Signup = class Signup {
  constructor(page) {
    this.page = page;
  }

  async signup(firstName, lastName, email, company, password, confirmPassword) {
    await this.page.getByText("Sign up").click();
    await this.page.locator("#first-name").fill(firstName);
    await this.page.locator("#last-name").fill(lastName);
    await this.page.locator("#email").fill(email);
    await this.page.locator("#organisation-name").fill(company);
    await this.page.locator('input[id="password"]').first().fill(password);
    await this.page
      .locator('input[name="confirmPassword"]')
      .fill(confirmPassword);
    await this.page.getByRole("checkbox", { name: "terms" }).check();
    await this.page.getByText("Create an account").click();
    await expect(this.page.locator(".Toastify")).toHaveText(
      "User registered successfully"
    );
    // await this.page.goto("https://yopmail.com/en/");
    // await this.page.getByPlaceholder("Enter your inbox here").click();
    // await this.page.getByPlaceholder("Enter your inbox here").fill("divanshu");
    // await this.page
    //   .getByRole("button", { title: "Check Inbox @yopmail.com" })
    //   .click();
    // await this.page.getByText("notifications@lx-medical.com").click();
  }
};
