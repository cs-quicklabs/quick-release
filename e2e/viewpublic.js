const { test, expect } = require("@playwright/test");
exports.viewPublic = class viewPublic {
  constructor(page) {
    this.page = page;
    this.description =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry";
    this.version = "2";
    this.title = "Test";
  }

  async viewDetails() {
    await this.page.waitForTimeout(5000);
    if (await expect(this.page.getByText("See Details")).toBeVisible()) {
      await this.page.getByText("See Details").click();

      // await expect(this.page.locator("//div[@class='ql-editor']")).toHaveText(
      //   this.description
      // );
      // await this.page.locator("#see-all-changelogs").click();
    }
  }
};
