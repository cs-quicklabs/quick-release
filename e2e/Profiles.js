const { test, expect } = require("@playwright/test");
export class Profiles {
  constructor(page) {
    this.page = page;
    this.firstNameInput = 'input[name="firstName"]';
    this.lastNameInput = 'input[name="lastName"]';
    this.userMenu = this.page.locator('#open-user-menu')
    this.profileSettingsButton = this.page.locator('#profile-settings')
  }

  async openUserMenuAndNavigateToSettings() {
    const maxRetries = 10; 
    const retryInterval = 3000; 
    
    let isUser = false;
    
    for (let i = 0; i < maxRetries; i++) {
      isUser = await this.userMenu.isVisible();
      if (isUser) {
        await this.userMenu.click()
        await this.profileSettingsButton.click()
        break;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval)); 
    }
    await expect(
      this.page.locator("text=Change your personal profile settings")
    ).toBeVisible({timeout:50000});
  }

  async verifyProfilePageElements() {
    await expect(this.page.locator("text=Upload avatar")).toBeVisible();
    await expect(this.page.locator("text=First Name")).toBeVisible();
    await expect(this.page.locator("text=Last Name")).toBeVisible();
  }

  async updateProfile() {
    const Numeric = await Math.floor(10000 + Math.random() * 90000).toString();
    await this.openUserMenuAndNavigateToSettings();
    await this.page.locator(this.firstNameInput).click();
    await this.page.locator(this.firstNameInput).press("Backspace");
    await this.page.locator(this.firstNameInput).fill("Divanshu"+Numeric);
    await this.page.locator(this.lastNameInput).click();
    await this.page.locator(this.lastNameInput).press("Backspace");
    await this.page.locator(this.lastNameInput).fill("Gupta"+Numeric);
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
