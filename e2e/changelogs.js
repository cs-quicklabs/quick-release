const { test, expect } = require("@playwright/test");
exports.Changelog = class changelog {
  constructor(page) {
    this.page = page;
    this.description =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry";
    this.version = "2";
    this.title = "Test";
  }

  async cancelChangelog() {
    await this.page.waitForTimeout(5000);
    if (await this.page.locator("#add-new").isVisible()) {
      await this.page.locator("#add-new").click();
      await this.page.locator("#title").fill(this.title);
      await this.page
        .locator("//div[@class='ql-editor ql-blank']")
        .fill(this.description);
      await this.page
        .getByPlaceholder("Enter release version")
        .fill(this.version);
      await this.page.locator("#react-select-3-input").click();
      await this.page.getByText("New", { exact: true }).click();
      await this.page.locator("#react-select-5-input").click();
      await this.page.getByText("Cancel").click();
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
      await this.page.getByText("Cancel").click();
    }
  }

  async publishChangelog() {
    await this.page.waitForTimeout(5000);
    if (await this.page.getByText("Add New").isVisible()) {
      await this.page.locator("#add-new").click();
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
      await this.page.getByText("Publish Changelog Now").click();
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
      await this.page.getByText("Publish Changelog Now").click();
    }
  }

  async saveChangelog() {
    await this.page.waitForTimeout(5000);
    if (await this.page.getByText("Add New").isVisible()) {
      await this.page.locator("#add-new").click();
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
      await this.page
        .getByRole("button", { name: "Change published status" })
        .click();
      await this.page.getByText("Save as Draft", { exact: true }).click();
      await this.page.getByText("Save as Draft Changelog").click();
    } else {
      console.log("click");
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
      await this.page
        .getByRole("button", { name: "Change published status" })
        .click();
      await this.page.getByText("Save as Draft", { exact: true }).click();
      await this.page.getByText("Save as Draft Changelog").click();
    }
  }
};
