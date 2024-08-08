const { test, expect } = require("@playwright/test");
exports.Signout = class Signout {
  constructor(page) {
    this.page = page;
    this.userMenu= this.page.locator("#open-user-menu");
    this.signOutButton = this.page.locator("text=Logout");
    this.confirmLogoutButton = this.page.locator(
      "button:has-text('Yes, I\\'m sure')"
    );
  }

  async navigateToTeamSetting() {
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
  }

  async clickSignOut() {
    await expect(this.signOutButton).toBeVisible("Logout")
    await this.signOutButton.click();
  }

  async confirmLogout() {
    await this.confirmLogoutButton.click();
  }

  async logout() {
    await this.openUserMenu();
    await this.clickSignOut();
    await this.confirmLogout();
  }
};
