const { test, expect } = require("@playwright/test");
exports.releaseCategory = class releaseCategory {
  constructor(page) {
    this.page = page;
    this.categoryName = "Test9";
    this.toastMessage = this.page.locator("//div[@class='Toastify']");

    // Locators
    this.userMenu = this.page.locator("#open-user-menu");
    this.teamSetting = this.page.locator("#team-setting");
    this.categoryLink = this.page.getByRole("link", { name: "Categories" });
    this.categoryNameInput = this.page.locator("#categoryName");
    this.saveButton = this.page.getByText("Save");
    this.editCategoryNameInput = this.page.locator("#editCategoryName");
    this.editSaveButton = this.page.locator("#savecategory");
    this.editLink = this.page.getByRole("link", { name: "Edit" }).first();
    this.deleteLink = this.page.getByRole("link", { name: "Delete" }).first();
  }

  async navigateToTeamSetting() {
    await this.userMenu.click();
    await this.teamSetting.click();
  }

  async navigateToCategories() {
    await this.navigateToTeamSetting();
    await this.categoryLink.click();
    await this.page.waitForTimeout(5000);
  }

  async createCategory() {
    await this.navigateToCategories();
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    await this.categoryNameInput.fill(this.categoryName + numeric);
    await this.saveButton.click();
    await this.page.waitForTimeout(5000);
    await expect(this.toastMessage).toHaveText(
      "Create release Category successfully"
    );
  }

  async editCategory() {
    await this.navigateToCategories();
    await this.categoryLink.waitFor("visible");
    await this.editLink.click();
    await this.editCategoryNameInput.click();
    await this.editCategoryNameInput.press("Backspace");
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    await this.editCategoryNameInput.fill(this.categoryName + numeric);
    await this.editSaveButton.click();
  }

  async deleteCategory() {
    await this.navigateToCategories();
    await this.page.waitForTimeout(5000);
    await this.deleteLink.click();
  }
};
