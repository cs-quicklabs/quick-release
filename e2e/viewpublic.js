const { test, expect } = require("@playwright/test");

exports.viewPublic = class viewPublic {
  constructor(page) {
    this.page = page;
    this.description =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    this.version = "2";
    this.title = "Test";
    this.seeDetailsButton = this.page.locator("text=See Details");
    this.continueEditinglink = this.page.locator("text=Continue Editing");
    this.changelogEditor = this.page.locator("//div[@class='ql-editor']");
    this.seeAllChangelogsButton = this.page.locator("#see-all-changelogs");
  }

  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }
  
  async isSeeDetailsVisible() {
    return await this.seeDetailsButton.isVisible();
  }

  async isContinueEditingVisible() {
    return await this.continueEditinglink.isVisible();
  }

  async clickSeeDetails() {
    await this.seeDetailsButton.click();
  }

  async clickContinueEditing() {
    await this.continueEditinglink.click();
  }

  async verifyChangelogDescription() {
    await expect(this.changelogEditor).toHaveText(this.description);
  }

  async clickSeeAllChangelogs() {
    await this.seeAllChangelogsButton.click();
  }

  async viewChangelogDetails() {
    const maxRetries = 10;
    const retryInterval = 3000;

    let isSeeDetailsVisible = false;

    for (let i = 0; i < maxRetries; i++) {
      isSeeDetailsVisible = await this.isSeeDetailsVisible();
      if (isSeeDetailsVisible) {
        await this.clickSeeDetails();
        break;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }

    if (!isSeeDetailsVisible) {
      const isContinueEditingVisible = await this.isContinueEditingVisible();
      if (isContinueEditingVisible) {
        await this.clickContinueEditing();
      } else {
        console.log("Neither 'See Details' nor 'Continue Editing' link is visible. Aborting operation.");
        return;
      }
    }
    
  }
};
