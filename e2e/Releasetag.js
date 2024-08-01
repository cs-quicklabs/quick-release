const { test, expect } = require("@playwright/test");
exports.releaseTags = class releaseTags {
  constructor(page) {
    this.page = page;
    this.tagname = "Test9";
    this.toastMessage = this.page.locator("//div[@class='Toastify']");

    // Locators
    this.userMenu = this.page.locator("#open-user-menu");
    this.teamSetting = this.page.locator("#team-setting");
    this.tagNameInput = this.page.locator("#tagname");
    this.saveButton = this.page.getByText("Save");
    this.editTagNameInput = this.page.locator("#editTagName");
    this.editSaveButton = this.page.locator("#editSave");
    this.editLink = this.page.getByRole("link", { name: "Edit" }).first();
    this.deleteLink = this.page.getByRole("link", { name: "Delete" }).first();
  }

  async navigateToTeamSetting() {
    await this.userMenu.click();
    await this.teamSetting.click();
  }

  async createReleaseTag() {
    await this.navigateToTeamSetting();
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    await this.tagNameInput.fill(this.tagname + numeric);
    await this.saveButton.click();
    await expect(this.toastMessage).toHaveText(
      "Create release tag successfully"
    );
  }

  async editReleaseTag() {
    await this.navigateToTeamSetting();
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    console.log(numeric);
    await this.tagNameInput.fill(this.tagname + numeric);
    await this.saveButton.click();
    await expect(this.toastMessage).toHaveText(
      "Create release tag successfully"
    );
    await this.editLink.click();
    await this.editTagNameInput.click();
    await this.editTagNameInput.press("Backspace");
    await this.editTagNameInput.fill(this.tagname + numeric);
    await this.editSaveButton.click();
  }

  async deleteReleaseTag() {
    await this.navigateToTeamSetting();
    await this.deleteLink.waitFor("visible"); 
    await this.deleteLink.click();
  }
};
