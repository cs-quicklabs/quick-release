const { test, expect } = require("@playwright/test");
exports.changePassword = class changePassword {
  constructor(page) {
    this.page = page;
  }

  async changePassword() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#profile-settings").click();
    await expect(this.page.getByText("Profile")).toBeVisible();
    await this.page.getByText("Change Password").click();
    await this.page.locator("input[name='oldPassword']").fill("pass1234");
    await this.page.locator("input[name='password']").fill("pass12345");
    await this.page.locator("input[name='confirmPassword']").fill("pass12345");
    await this.page.getByText("Save").click();
  }
};
