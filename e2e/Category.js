const { test, expect } = require("@playwright/test");
exports.releaseCategory = class releaseCategory {
  constructor(page) {
    this.page = page;
    this.categoryName = "Test9";
    this.toastMessage = this.page.locator("//div[@class='Toastify']");
  }

  async createCategory() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#team-setting").click();
    await this.page.waitForTimeout(5000);
    const Numeric = await Math.floor(10000 + Math.random() * 90000).toString();
    await console.log(Numeric);
    await this.page.getByRole("link", { name: "Categories" }).click();
    await this.page.locator("#categoryName").fill(this.categoryName + Numeric);
    await this.page.getByText("Save").click();
    await this.page.waitForTimeout(5000);
    await expect(this.page.locator(".Toastify")).toHaveText(
      "Create release Category successfully"
    );
  }
  async editCategory() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#team-setting").click();
    await this.page.getByRole("link", { name: "Categories" }).click();
    await this.page.waitForTimeout(5000);
    await this.page.getByRole("link", { name: "Edit" }).first().click();
    await this.page.locator("#editCategoryName").click();
    await this.page.locator("#editCategoryName").press("Backspace");
    const Numeric = await Math.floor(10000 + Math.random() * 90000).toString();
    await this.page
      .locator("#editCategoryName")
      .fill(this.categoryName + Numeric);
    await this.page.locator("#savecategory").click();
  }
  async deleteCategory() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#team-setting").click();
    await this.page.waitForTimeout(5000);
    await this.page.getByRole("link", { name: "Categories" }).click();

    await this.page.getByRole("link", { name: "Delete" }).first().click();
  }
};
