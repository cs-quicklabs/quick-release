const { test, expect } = require("@playwright/test");
exports.changePassword = class changePassword {
  constructor(page) {
    this.page = page;
    this.userMenuButton = this.page.locator("#open-user-menu");
    this.profileSettingsButton = this.page.locator("#profile-settings");
    this.changePasswordButton = this.page.getByText("Change Password");
    this.oldPasswordInput = this.page.locator("input[name='oldPassword']");
    this.newPasswordInput = this.page.locator("input[name='password']");
    this.confirmPasswordInput = this.page.locator(
      "input[name='confirmPassword']"
    );
    this.saveButton = this.page.getByText("Save");
    this.profileSettingsHeader = this.page.getByText(
      "Change your personal profile settings"
    );
  }

  async openUserMenu() {
    await this.userMenuButton.click();
  }

  async navigateToProfileSettings() {
    await this.profileSettingsButton.click();
  }

  async waitForProfileSettings() {
    await this.page.waitForTimeout(5000);
  }

  async verifyProfileSettingsPage() {
    await expect(this.profileSettingsHeader).toBeVisible();
  }

  async clickChangePassword() {
    await this.changePasswordButton.click();
  }

  async fillOldPassword(password) {
    await this.oldPasswordInput.fill(password);
  }

  async fillNewPassword(password) {
    await this.newPasswordInput.fill(password);
  }

  async fillConfirmPassword(password) {
    await this.confirmPasswordInput.fill(password);
  }

  async savePassword() {
    await this.saveButton.click();
  }

  async changePassword(oldPassword, newPassword) {
    await this.openUserMenu();
    await this.navigateToProfileSettings();
    await this.waitForProfileSettings();
    await this.verifyProfileSettingsPage();
    await this.clickChangePassword();
    await this.fillOldPassword(oldPassword);
    await this.fillNewPassword(newPassword);
    await this.fillConfirmPassword(newPassword);
    await this.savePassword();
  }
};
