const { test, expect } = require("@playwright/test");
exports.releaseCategory = class releaseCategory {
  constructor(page) {
    this.page = page;
    this.categoryName = "Test9";
    this.toastMessage = this.page.locator("//div[@class='Toastify']");

    // Locators
    this.userMenu = this.page.locator("#open-user-menu");
    this.accountSetting = this.page.locator("#account-settings");
    this.categoryLink = this.page.getByRole("link", { name: "Categories" });
    this.categoryNameInput = this.page.locator("#categoryName");
    this.saveButton = this.page.getByText("Save");
    this.editCategoryNameInput = this.page.locator("#editCategoryName");
    this.editSaveButton = this.page.locator("#savecategory");
    this.editLink = this.page.getByRole("link", { name: "Edit" }).first();
    this.deleteLink = this.page.getByRole("link", { name: "Delete" }).first();
  }

  async navigateToAccountSetting(){
    const maxRetries = 10; 
    const retryInterval = 3000; 
    
    let isUser = false;
    
    for (let i = 0; i < maxRetries; i++) {
      isUser = await this.userMenu.isVisible();
      if (isUser) {
        await this.userMenu.click()
        break;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval)); 
    }
    await this.accountSetting.click()
  }

  async navigateToCategories() {
    await this.categoryLink.click();
  }

  async createCategory() {
    await this.navigateToAccountSetting();
    await this.navigateToCategories();
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    await this.categoryNameInput.fill(this.categoryName + numeric);
    await this.saveButton.click();
    await expect(this.toastMessage).toHaveText(
      "Create release Category successfully"
    );
  }

  async editCategory() {
    await this.navigateToAccountSetting();
    await this.navigateToCategories();
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    console.log(numeric);
    await this.categoryNameInput.fill(this.categoryName + numeric);
    await this.saveButton.click();
    await expect(this.toastMessage).toHaveText(
      "Create release Category successfully"
    );
    await this.editLink.click();
    await this.editCategoryNameInput.click();
    await this.editCategoryNameInput.press("Backspace");
    await this.editCategoryNameInput.fill(this.categoryName + numeric);
    await this.editSaveButton.click();
  }


 
  async deleteCategory() {
    await this.navigateToAccountSetting();
    await this.navigateToCategories();
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    console.log(numeric);
    await this.categoryNameInput.fill(this.categoryName + numeric);
    await this.saveButton.click();
    await expect(this.toastMessage).toHaveText(
      "Create release Category successfully"
    );
    await this.deleteLink.click();
  }
};
