const { test, expect } = require("@playwright/test");
exports.Changelog = class changelog {
  constructor(page) {
    this.page = page;
    this.description =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    this.version = "2";
    this.title = "Test";

    this.addNewButton = this.page.locator("#add-new");
    this.quickrelease=this.page.getByText("Quick Release")
    this.newChangelogButton = this.page.getByRole("button", {
      name: "New Changelog",
    });

    this.titleInput = this.page.locator('input[name="title"]');
    this.descriptionEditor = this.page.locator(".ql-editor");
    this.versionInput = this.page.getByPlaceholder("Enter release version");
    this.newStatusOption = this.page.locator('.release-category-select-menu-prefix > div:nth-child(2)')
    this.relasetags=this.page.locator('.release-tag-select-menu-prefix > div:nth-child(2)')
    this.cancelButton = this.page.getByText("Cancel");
    this.publishButton = this.page.getByText("Publish Changelog Now");
    this.openOptionsButton = this.page.locator("#open-options");
    this.editChangelogButton = this.page.locator("#edit-changelog");
    this.editChangelogModalTitle = this.page.getByText("Edit Change Log");
    this.changeStatusButton = this.page.getByRole("button", {
      name: "Change published status",
    });
    this.saveAsDraftOption = this.page.getByText("Save as Draft", {
      exact: true,
    });
    this.saveAsDraftChangelogButton = this.page.getByText(
      "Save as Draft Changelog"
    );
    this.loadingComponent= this.page.locator("#loading")
  }

  async waitForTimeout(timeout) {
    await this.page.waitForTimeout(timeout);
  }

  async clickAddNewButton() {
    await this.addNewButton.click();
  }

  async clickNewChangelogButton() {
    await this.newChangelogButton.click();
  }


  async fillTitle() {
    const Numeric = await Math.floor(10000 + Math.random() * 90000).toString();
    await console.log(Numeric);
    await this.titleInput.fill(this.title + Numeric);
  }

  
  async clickOpenOptions() {
    await this.openOptionsButton.click();
  }

  async clickEditChangelog() {
    await this.editChangelogButton.click();
  }

  async isEditChangelogModalVisible() {
    return await this.editChangelogModalTitle.isVisible();
  }

  async editTitle() {
    await this.titleInput.click();
    await this.titleInput.press("Backspace");
    await this.titleInput.fill('test13');
  }

  async fillDescription() {
    await this.descriptionEditor.fill(this.description);
  }

  async fillVersion() {
    await this.versionInput.fill(this.version);
  }

  async selectStatusCategory() {
    await this.newStatusOption.first().click();
  }
  async selectStatusTags() {
    await this.newStatusOption.first().click();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async clickPublishButton() {
    await this.publishButton.click();
  }

  async clickChangeStatusButton() {
    await this.changeStatusButton.click();
  }

  async clickSaveAsDraftOption() {
    await this.saveAsDraftOption.click();
  }

  async clickSaveAsDraftChangelogButton() {
    await this.saveAsDraftChangelogButton.click();
  }


  async cancelChangelog() {
    const maxRetries = 10; 
    const retryInterval = 3000; 
    
    let isAddNewButtonVisible = false;
    
    for (let i = 0; i < maxRetries; i++) {
      isAddNewButtonVisible = await this.addNewButton.isVisible();
      if (isAddNewButtonVisible) {
        await this.clickAddNewButton();
        break;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval)); 
    }
    
    if (!isAddNewButtonVisible) {
      await this.clickNewChangelogButton();
    }
    
    
    await this.fillTitle();
    await this.fillDescription();
    await this.fillVersion();
    await this.selectStatusCategory();
    await this.selectStatusTags();
    await this.clickChangeStatusButton();
    await this.clickCancelButton();
  }

  async publishChangelog() {
    const maxRetries = 10; 
    const retryInterval = 3000; 
    
    let isAddNewButtonVisible = false;
    
    for (let i = 0; i < maxRetries; i++) {
      isAddNewButtonVisible = await this.addNewButton.isVisible();
      if (isAddNewButtonVisible) {
        await this.clickAddNewButton();
        break;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval)); 
    }
    
    if (!isAddNewButtonVisible) {
      await this.clickNewChangelogButton();
    }
    await this.fillTitle();
    await this.fillDescription();
    await this.fillVersion();
    await this.selectStatusCategory();
    await this.selectStatusTags();
    await this.clickChangeStatusButton();
    await this.clickPublishButton();
  }

  
  async saveChangelog() {
   
    const maxRetries = 10; 
    const retryInterval = 3000; 
    
    let isAddNewButtonVisible = false;
    
    for (let i = 0; i < maxRetries; i++) {
      isAddNewButtonVisible = await this.addNewButton.isVisible();
      if (isAddNewButtonVisible) {
        await this.clickAddNewButton();
        break;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval)); 
    }
    
    if (!isAddNewButtonVisible) {
      await this.clickNewChangelogButton();
    }
    await this.fillTitle();
    await this.fillDescription();
    await this.fillVersion();
    await this.selectStatusCategory();
    await this.selectStatusTags();
    await this.clickChangeStatusButton();
    await this.clickSaveAsDraftOption();
    await this.clickSaveAsDraftChangelogButton();
    await this.clickOpenOptions();
    await this.clickEditChangelog();
    await this.editTitle();
    await this.clickChangeStatusButton();
    await this.clickSaveAsDraftOption();
    await this.clickSaveAsDraftChangelogButton();
        
  }
};
