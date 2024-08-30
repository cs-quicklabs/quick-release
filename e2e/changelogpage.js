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

  async isAddNewButtonVisible() {
    return await this.addNewButton.isVisible();
  }

  async isNewChangeLogVisible() {
    return await this.newChangeLog.isVisible();
  }

  async clickOpenOptions() {
    await this.openOptionsButton.click();
  }

  async clickEditChangelog() {
    await this.editChangelogButton.click();
  }

  async isEditChangelogModalVisible() {
    return await this.editChangelogModalTitle.isVisible();
  }

  async editTitle(newTitle) {
    await this.titleInput.click();
    await this.titleInput.press("Backspace");
    await this.titleInput.fill(newTitle);
  }

  async clickPublishChangelog() {
    await this.publishChangelogButton.click();
  }

  async isDescriptionVisible() {
    const text = await this.descriptionLocator.textContent();
    return text.includes(this.description);
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async changelogElements() {
    await this.addNewButton.waitFor("visible");
    if (await this.isAddNewButtonVisible()) {
      await expect(this.descriptions).toHaveText(this.description);
    } else {
      await expect(this.isNewChangeLogVisible()).toBeTruthy();
    }
  }

  async editChangelog() {
    await this.addNewButton.waitFor("visible");
    if (await this.isAddNewButtonVisible()) {
      await this.clickOpenOptions();
      await this.clickEditChangelog();
      await this.page.waitForTimeout(5000);
      await this.editTitle("test13");
      await this.clickPublishChangelog();
    }
  }

  async deleteChangelog() {
    await this.clickOpenOptions();
    await this.clickDelete();
  }
};
