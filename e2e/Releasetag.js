const { test, expect } = require("@playwright/test");
exports.releaseTags = class releaseTags {
  constructor(page) {
    this.page = page;
    this.tagname = "Test3";
  }

  async releaseTag() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#team-setting").click();
    await this.page.waitForTimeout(5000);
    await this.page.locator("#tagname").fill(this.tagname);
    await this.page.getByText("Save").click();
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

    await this.page.locator("#editTagName").fill("RETEST");
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
