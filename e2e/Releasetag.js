const { test, expect } = require("@playwright/test");
exports.releaseTags = class releaseTags {
  constructor(page) {
    this.page = page;
    this.tagname = "Test9";
    this.toastMessage = this.page.locator("//div[@class='Toastify']");
  }

  async createReleaseTag() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#team-setting").click();
    await this.page.waitForTimeout(5000);
    const Numeric = await Math.floor(10000 + Math.random() * 90000).toString();
    await console.log(Numeric);
    await this.page.locator("#tagname").fill(this.tagname + Numeric);
    await this.page.getByText("Save").click();
    await this.page.waitForTimeout(5000);
    await expect(this.page.locator(".Toastify")).toHaveText(
      "Create release tag successfully"
    );
  }
  async editReleaseTag() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#team-setting").click();
    await this.page.waitForTimeout(5000);
    await this.page.getByRole("link", { name: "Edit" }).first().click();
    await this.page.locator("#editTagName").click();
    await this.page.locator("#editTagName").press("Backspace");
    const Numeric = await Math.floor(10000 + Math.random() * 90000).toString();
    await this.page.locator("#editTagName").fill(this.tagname + Numeric);
    await this.page.locator("#editSave").click();
  }
  async deleteReleaseTag() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#team-setting").click();
    await this.page.waitForTimeout(5000);
    await this.page.waitForTimeout(5000);
    await this.page.getByRole("link", { name: "Delete" }).first().click();
  }
};
