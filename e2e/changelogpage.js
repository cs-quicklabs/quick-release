const { test, expect } = require("@playwright/test");
exports.Changelogdetail = class Changelogdetail {
  constructor(page) {
    this.page = page;
    this.description =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry";
    this.version = "2";
    this.title = "Test";
  }

  async changelogelements() {
    if (
      await this.page
        .locator("//button[normalize-space()='Add New']")
        .isVisible()
    ) {
      await expect(
        this.page.locator(
          "//div[@class='ql-editor']//p[contains(text(),'Lorem Ipsum is simply dummy text of the printing a')]"
        )
      ).toHaveText(this.description);
    } else {
      await this.page
        .locator("//button[normalize-space()='New Changelog']")
        .isVisible();
    }

    await this.page.waitForTimeout(5000);
  }

  async editchangelog() {
    if (await this.page.getByText("Continue Editing").isVisible()) {
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
      await this.page.getByText("Change published status").click();
      await this.page.getByText("Publish Changelog Now").click();
      await expect(
        this.page.locator(
          "//div[@class='ql-editor']//p[contains(text(),'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry')]"
        )
      ).toHaveText(this.description);
      await this.page
        .locator("(//*[name()='svg'][@name='Open options'])[1]")
        .click();
      await this.page.getByText("Edit").click();
      await expect(this.page.getByText("Edit change log")).toBeVisible();
      await this.page.locator('input[name="title"]').click();
      await this.page.locator('input[name="title"]').press("Backspace");
      await this.page.locator('input[name="title"]').fill("test12");
      await this.page.getByText("Publish Changelog Now").click();
    } else {
      await expect(
        this.page.locator(
          "//div[@class='ql-editor']//p[contains(text(),'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry')]"
        )
      ).toHaveText(this.description);
      await this.page
        .locator("(//*[name()='svg'][@name='Open options'])[1]")
        .click();
      await this.page.getByText("Edit").click();
      await expect(this.page.getByText("Edit change log")).toBeVisible();
      await this.page.locator('input[name="title"]').click();
      await this.page.locator('input[name="title"]').press("Backspace");
      await this.page.locator('input[name="title"]').fill("test12");
      await this.page.getByText("Publish Changelog Now").click();
    }
  }

  async deletechangelog() {
    await expect(
      this.page.locator(
        "//div[@class='ql-editor']//p[contains(text(),'Lorem Ipsum is simply dummy text of the printing a')]"
      )
    ).toHaveText(this.description);
    await this.page
      .locator("(//*[name()='svg'][@name='Open options'])[1]")
      .click();
    await this.page.getByText("Delete").click();
    //   }
  }
};
