const { test, expect } = require("@playwright/test");
exports.viewpublic = class viewpublic {
  constructor(page) {
    this.page = page;
    this.description =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry";
    this.version = "2";
    this.title = "Test";
  }

  async viewdetails() {
    await this.page.getByText("See Details").click();
    await this.page.waitForTimeout(5000);

    await expect(
      this.page.locator(
        "//p[contains(text(),'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry')]"
      )
    ).toHaveText(this.description);
    await this.page.getByText("See All Changelogs").click();
    await this.page.waitForTimeout(5000);
    await this.page.getByText("Select Categories").click();
  }
};
