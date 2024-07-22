const { test, expect, locator } = require("@playwright/test");
exports.ChangelogDetail = class ChangelogDetail {
  constructor(page, description) {
    this.page = page;
    this.description = description;
    this.addNewButton = this.page.getByText("Add New");
    this.newChangeLog = this.page.locator("#new-changelog");
    this.openOptionsButton = this.page.locator("#open-options");
    this.editChangelogButton = this.page.locator("#edit-changelog");
    this.editChangelogModalTitle = this.page.getByText("Edit Change Log");
    this.titleInput = this.page.locator('input[name="title"]');
    this.publishChangelogButton = this.page.getByText("Publish Changelog Now");
    this.descriptionLocator = this.page.locator(".ql-editor");
    this.deleteButton = this.page.getByText("Delete");
    this.descriptions = this.page.locator("//div[@class='ql-editor']");
  }



  async isNewChangeLogVisible() {
    return await this.newChangeLog.isVisible();
  }
  async clickOpenOptions() {
    await this.openOptionsButton.click();
  }

  async isDescriptionVisible() {
    const text = await this.descriptionLocator.textContent();
    console.log(`Description text found: ${text}`);
    return text.includes(this.description);
  }

  async clickDelete() {
    await this.deleteButton.click();
  }



  async removeChangelog() {
    if(isAddNewButtonVisible())
    {
    await this.clickOpenOptions();
    await this.clickDelete();
    }
   if(!isAddNewButtonVisible())
   {
    test.skip()
   }
}

}