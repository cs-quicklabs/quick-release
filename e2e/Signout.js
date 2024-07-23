const { test, expect } = require("@playwright/test");
exports.Signout = class Signout {
  constructor(page) {
    this.page = page;
    this.userMenuButton = this.page.locator("#open-user-menu");
    this.signOutButton = this.page.locator("text=Logout");
    this.confirmLogoutButton = this.page.locator(
      "button:has-text('Yes, I\\'m sure')"
    );
  }

  async openUserMenu() {
    await this.userMenuButton.click();
  }

  async clickSignOut() {
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
