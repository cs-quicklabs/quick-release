const { test, expect } = require("@playwright/test");
exports.searchchangelog = class searchchangelog {
  constructor(page) {
    this.page = page;
    this.description =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry";
    this.version = "5";
    this.title = "ABC";
  }

  async searchchangelog() {
    await this.page.waitForSelector("//button[normalize-space()='Add New']", {
      state: "visible",
      timeout: 60000,
    });
    if (
      await this.page
        .locator("//button[normalize-space()='Add New']")
        .isVisible()
    ) {
      // 'Add New' button is visible, perform the actions
      await this.page.locator("//button[normalize-space()='Add New']").click();
      await this.page.locator('input[name="title"]').fill(this.title);
      await this.page
        .locator("//div[@class='ql-editor ql-blank']")
        .fill(this.description);
      await this.page
        .getByPlaceholder("Enter release version")
        .fill(this.version);
      await this.page.locator("#react-select-3-input").click();
      await this.page.getByText("New", { exact: true }).click();
      await this.page.locator("#react-select-5-input").click();
      await this.page.getByText("Web", { exact: true }).click();
      await this.page.getByText("Publish Changelog Now").click();
      await this.page.waitForTimeout(5000);
    } else {
      await this.page
        .locator("//button[normalize-space()='New Changelog']")
        .click();
      await this.page.locator('input[name="title"]').fill(this.title);
      await this.page
        .locator("//div[@class='ql-editor ql-blank']")
        .fill(this.description);
      await this.page
        .getByPlaceholder("Enter release version")
        .fill(this.version);
      await this.page.locator("#react-select-3-input").click();
      await this.page.getByText("New", { exact: true }).click();
      await this.page.locator("#react-select-5-input").click();
      await this.page.getByText("Web", { exact: true }).click();
      await this.page.getByText("Publish Changelog Now").click();
      await this.page.waitForTimeout(5000);
    }
    {
      await this.page.locator("#search").fill(this.title);
    }
    await this.page.locator("#search").fill(this.title);
  }
};
