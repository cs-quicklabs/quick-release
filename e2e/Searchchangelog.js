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
    await this.page.waitForSelector("#Add-New", {
      state: "visible",
      timeout: 600,
    });
    {
      await this.page.locator("#search").fill(this.title);
    }
  }
};
