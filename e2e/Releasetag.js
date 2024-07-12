const { test, expect } = require("@playwright/test");
exports.releaseTags = class releaseTags {
  constructor(page) {
    this.page = page;
  }

  async releaseTag() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#team-setting").click();
    await this.page.waitForURL("http://localhost:3000/settings/team/tags");
  }
};
