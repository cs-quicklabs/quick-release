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
    if (await this.page.locator("#Add-New").isVisible()) {
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
    await expect(this.page.locator("//div[@class='ql-editor']")).toHaveText(
      this.description
    );
    await this.page.locator("#open-options").click();
    await this.page.locator("#edit-changelog").click();
    await expect(this.page.getByText("Edit change log")).toBeVisible();
    await this.page.locator('input[name="title"]').click();
    await this.page.locator('input[name="title"]').press("Backspace");
    await this.page.locator('input[name="title"]').fill("test12");
    await this.page.getByText("Publish Changelog Now").click();
  }

  async deletechangelog() {
    await expect(this.page.locator("//div[@class='ql-editor']")).toHaveText(
      this.description
    );
    await this.page.locator("#open-options").click();
    await this.page.getByText("Delete").click();
    //   }
  }
};
