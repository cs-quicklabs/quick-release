const { test, expect } = require("@playwright/test");
const { TIMEOUT } = require("dns/promises");
exports.feedback = class Feedback{
  constructor(page) {
    this.page = page;
    this.feedbackname = "Test9";
    this.toastMessage = this.page.locator("//div[@class='Toastify']");

    // Locators
    this.userMenu = this.page.locator("#open-user-menu");
    this.teamSetting = this.page.locator("#team-setting");
    this.heading= this.page.getByRole('heading', { name: 'Feedback Boards' })
    this.boardName=this.page.locator("#boardName")
    this.saveButton = this.page.getByText("Save");
    this.editLink= this.page.getByRole("link", { name: "Edit" }).nth(1);
    this.editfeedbackNameInput=this.page.locator("#editBoardName")
    this.editSaveButton=this.page.locator("#saveboard")

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
    await this.teamSetting.click()
  }

async verifiedHeading()
  {
    const headingText = await this.heading.textContent();
    await expect(headingText).toContain("Feedback Boards");
  }

  async addFeedback()
  {
    await this.verifiedHeading()
    const numeric = Math.floor(10000 + Math.random() * 90000).toString();
    
    await this.boardName.fill(this.feedbackname+numeric)
    await this.saveButton.click()
    await expect(this.toastMessage).toHaveText(
        "Feedback board created successfully"
      );

  }

  async editFeedback()
  {
    await this.verifiedHeading();
  const numeric = Math.floor(10000 + Math.random() * 90000).toString();
  
  await this.boardName.fill(this.feedbackname + numeric);
  await this.saveButton.click();
  await expect(this.toastMessage).toHaveText(
    "Feedback board created successfully"
  );

    await this.editLink.isVisible({ timeout: 5000 });
    await this.editLink.click();
    await this.editfeedbackNameInput.click();
    await this.editfeedbackNameInput.press("Backspace");
    await this.editfeedbackNameInput.fill(this.tagname + numeric);
    await this.editSaveButton.click();
  } 

}