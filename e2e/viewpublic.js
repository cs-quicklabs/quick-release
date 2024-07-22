const { test, expect } = require("@playwright/test");
exports.viewPublic = class viewPublic {
  constructor(page) {
    this.page = page;
    this.description =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    this.version = "2";
    this.title = "Test";
    this.seeDetailsButton = this.page.locator("text=See Details");
    this.changelogEditor = this.page.locator("//div[@class='ql-editor']");
    this.seeAllChangelogsButton = this.page.locator("#see-all-changelogs");
  }

  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }

  async isSeeDetailsVisible() {
    return await this.seeDetailsButton.isVisible();
  }

  async clickSeeDetails() {
    await this.seeDetailsButton.click();
  }

  async verifyChangelogDescription() {
    await expect(this.changelogEditor).toHaveText(this.description);
  }

  async clickSeeAllChangelogs() {
    await this.seeAllChangelogsButton.click();
  }

  async viewChangelogDetails() {
    await this.page.waitForTimeout(5000)
    if (await this.isSeeDetailsVisible()) {
      await this.clickSeeDetails();
      await this.verifyChangelogDescription();
      await this.clickSeeAllChangelogs();
    }
  }
};
