const { test, expect } = require("@playwright/test");
exports.Profiles = class Profiles {
  constructor(page) {
    this.page = page;
    this.firstNameInput = 'input[name="firstName"]';
    this.lastNameInput = 'input[name="lastName"]';
    this.userMenuButton = this.page.locator("#open-user-menu");
    this.profileSettingsButton = this.page.locator("#profile-settings");
  }

  async openUserMenuAndNavigateToSettings() {
    await this.userMenuButton.click();
    await this.profileSettingsButton.click();
    await this.page.waitForTimeout(5000);
    await expect(
      this.page.locator("text=Change your personal profile settings")
    ).toBeVisible();
  }

  async verifyProfilePageElements() {
    await expect(this.page.locator("text=Upload avatar")).toBeVisible();
    await expect(this.page.locator("text=First Name")).toBeVisible();
    await expect(this.page.locator("text=Last Name")).toBeVisible();
  }

  async updateProfile(firstName, lastName) {
    await this.openUserMenuAndNavigateToSettings();
    await this.page.locator(this.firstNameInput).click({ clickCount: 3 });
    await this.page.locator(this.firstNameInput).press("Backspace");
    await this.page.locator(this.firstNameInput).fill(firstName);
    await this.page.locator(this.lastNameInput).click({ clickCount: 3 });
    await this.page.locator(this.lastNameInput).press("Backspace");
    await this.page.locator(this.lastNameInput).fill(lastName);
    await this.page.locator("text=Save").click();
  }

  async uploadProfileAvatar(filePath) {
    await this.openUserMenuAndNavigateToSettings();
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.page.locator("img[alt='No Image']").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }
};
