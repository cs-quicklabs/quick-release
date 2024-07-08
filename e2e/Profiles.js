const { test, expect } = require("@playwright/test");
exports.Profiles = class Profiles {
  constructor(page) {
    this.page = page;
    this.firstname = 'input[name="firstName"]';
    this.lastname = 'input[name="lastName"]';
  }
  async profileclick() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#profile-settings").click();
    await expect(this.page.getByText("Profile")).toBeVisible();
  }
  async profilepage() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#profile-settings").click();
    await expect(this.page.getByText("Profile Settings")).toBeVisible();
    await expect(this.page.getByText("Upload avatar")).toBeVisible();
    await expect(this.page.getByText("First Name")).toBeVisible();
    await expect(this.page.getByText("Last Name")).toBeVisible();
    await expect(this.page.getByText("Email", { exact: true })).toBeVisible();
  }

  async profileupdate(firstnames, lastName) {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#profile-settings").click();
    await this.page.locator(this.firstname).click();
    await this.page.locator(this.firstname).press("Backspace");
    await this.page.locator(this.firstname).fill(firstnames);
    await this.page.locator(this.lastname).click();
    await this.page.locator(this.lastname).press("Backspace");
    await this.page.locator(this.lastname).fill(lastName);
    await this.page.getByText("Save").click();
  }
  async profileupload() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#profile-settings").click();
    const filechooserPromose = this.page.waitForEvent("filechooser");
    await this.page.locator("//img[@alt='No Image']").click();
    const filechooser = await filechooserPromose;
    await filechooser.setFiles(
      "C:/Users/Admin/OneDrive/Pictures/Screenshots/Test.png"
    );
  }
};
