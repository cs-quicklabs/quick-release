const { test, expect } = require("@playwright/test");
exports.Changelog = class changelog {
  constructor(page) {
    this.page = page;
    this.description =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    this.version = "2";
    this.title = "Test";

    this.addNewButton = this.page.locator("#add-new");
    this.newChangelogButton = this.page.getByRole("button", {
      name: "New Changelog",
    });
    this.titleInput = this.page.locator('input[name="title"]');
    this.descriptionEditor = this.page.locator(
      "//div[@class='ql-editor ql-blank']"
    );
    this.versionInput = this.page.getByPlaceholder("Enter release version");
    this.statusInput = this.page.locator("#react-select-3-input");
    this.newStatusOption = this.page.getByText("New", { exact: true });
    this.cancelButton = this.page.getByText("Cancel");
    this.publishButton = this.page.getByText("Publish Changelog Now");
    this.changeStatusButton = this.page.getByRole("button", {
      name: "Change published status",
    });
    this.saveAsDraftOption = this.page.getByText("Save as Draft", {
      exact: true,
    });
    this.saveAsDraftChangelogButton = this.page.getByText(
      "Save as Draft Changelog"
    );
  }

  async waitForTimeout(timeout) {
    await this.page.waitForTimeout(timeout);
  }

  async clickAddNewButton() {
    await this.addNewButton.click();
  }

  async clickNewChangelogButton() {
    await this.newChangelogButton.click();
  }

  async fillTitle() {
    const Numeric = await Math.floor(10000 + Math.random() * 90000).toString();
    await console.log(Numeric);
    await this.titleInput.fill(this.title + Numeric);
  }

  async fillDescription() {
    await this.descriptionEditor.fill(this.description);
  }

  async fillVersion() {
    await this.versionInput.fill(this.version);
  }

  async selectStatus() {
    await this.statusInput.click();
    await this.newStatusOption.click();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async clickPublishButton() {
    await this.publishButton.click();
  }

  async clickChangeStatusButton() {
    await this.changeStatusButton.click();
  }

  async clickSaveAsDraftOption() {
    await this.saveAsDraftOption.click();
  }

  async clickSaveAsDraftChangelogButton() {
    await this.saveAsDraftChangelogButton.click();
  }

  async cancelChangelog() {
    await this.waitForTimeout(5000);
    if (await this.addNewButton.isVisible()) {
      await this.clickAddNewButton();
    } else {
      await this.clickNewChangelogButton();
    }
    await this.fillTitle();
    await this.fillDescription();
    await this.fillVersion();
    await this.selectStatus();
    await this.clickCancelButton();
    await this.waitForTimeout(5000);
  }

  async publishChangelog() {
    await this.waitForTimeout(5000);
    if (await this.addNewButton.isVisible()) {
      await this.clickAddNewButton();
    } else {
      await this.clickNewChangelogButton();
    }
    await this.fillTitle();
    await this.fillDescription();
    await this.fillVersion();
    await this.selectStatus();
    await this.clickPublishButton();
  }

  async saveChangelog() {
    await this.waitForTimeout(5000);
    if (await this.addNewButton.isVisible()) {
      await this.clickAddNewButton();
    } else {
      await this.clickNewChangelogButton();
    }
    await this.fillTitle();
    await this.fillDescription();
    await this.fillVersion();
    await this.selectStatus();
    await this.clickChangeStatusButton();
    await this.clickSaveAsDraftOption();
    await this.clickSaveAsDraftChangelogButton();
  }
};
