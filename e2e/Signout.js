const { test, expect } = require("@playwright/test");
exports.Signout = class Signout {
  constructor(page) {
    this.page = page;
  }

  async logout() {
    await this.page.locator("#open-user-menu").click();
    await this.page.getByText("Sign out").click();
    await this.page.getByRole("button", { name: "Yes, I'm sure" }).click();
  }
};
