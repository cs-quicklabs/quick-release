const { test, expect } = require("@playwright/test");
exports.Profiles = class Profiles {
  constructor(page) {
    this.page = page;
    this.firstname = 'input[name="firstName"]';
    this.lastname = 'input[name="lastName"]';
  }
  async profileClick() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#profile-settings").click();
    await expect(this.page.getByText("Profile")).toBeVisible();
  }
  async profilePage() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#profile-settings").click();
    await expect(this.page.getByText("Profile Settings")).toBeVisible();
    await expect(this.page.getByText("Upload avatar")).toBeVisible();
    await expect(this.page.getByText("First Name")).toBeVisible();
    await expect(this.page.getByText("Last Name")).toBeVisible();
    await expect(this.page.getByText("Email", { exact: true })).toBeVisible();
  }

  async profileUpdate(firstName, lastName) {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#profile-settings").click();
    await this.page.locator(this.firstname).click();
    await this.page.locator(this.firstname).press("Backspace");
    await this.page.locator(this.firstname).fill(firstName);
    await this.page.locator(this.lastname).click();
    await this.page.locator(this.lastname).press("Backspace");
    await this.page.locator(this.lastname).fill(lastName);
    await this.page.getByText("Save").click();
  }
  async profileUpload() {
    await this.page.locator("#open-user-menu").click();
    await this.page.locator("#profile-settings").click();
    const fileChooserPromise = this.page.waitForEvent("fileChooser");
    await this.page.locator("//img[@alt='No Image']").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(
      "C:/Users/Admin/OneDrive/Pictures/Screenshots/Test.png"
    );
  }
};
