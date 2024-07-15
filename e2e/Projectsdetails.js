const { test, expect } = require("@playwright/test");
exports.createProject = class Project {
  constructor(page) {
    this.page = page;
    this.projectName = "New";
    this.openUserMenuButton = this.page.locator("#open-user-menu");
    this.addNewProjectButton = this.page.locator("text=Add new project");
    this.projectInput = this.page.locator("#company-website");
    this.saveButton = this.page.locator("text=Save");
    this.toastMessage = this.page.locator("//div[@class='Toastify']");
    this.emailError = this.page.locator("#email-error");
  }

  async openUserMenuAndNavigateToAddProject() {
    await this.openUserMenuButton.click();
    await this.addNewProjectButton.click();
  }

  async createProject() {
    const Numeric = await Math.floor(10000 + Math.random() * 90000).toString();
    await console.log(Numeric);
    await this.openUserMenuAndNavigateToAddProject();
    await this.projectInput.click();
    await this.projectInput.fill(this.projectName + Numeric);
    await expect(this.projectInput).toHaveValue(this.projectName + Numeric);
    await this.saveButton.click();
    await this.page.waitForTimeout(5000);
    await expect(this.toastMessage).toHaveText("Project created successfully");
  }

  async attemptToCreateExistingProject() {
    await this.openUserMenuAndNavigateToAddProject();
    await this.projectInput.click();
    await this.projectInput.fill(this.projectName);
    await expect(this.projectInput).toHaveValue(this.projectName);
    await this.saveButton.click();
    await expect(this.toastMessage).toHaveText("Project name is already taken");
  }

  async projectValidationWithEmptyName() {
    await this.openUserMenuAndNavigateToAddProject();
    await this.projectInput.click();
    await this.projectInput.fill("   "); // Fill with empty spaces to trigger validation
    await this.saveButton.click();
    await expect(this.emailError).toHaveText("Required");
  }
};
