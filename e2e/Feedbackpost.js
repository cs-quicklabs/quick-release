const { test, expect } = require("@playwright/test");
const { TIMEOUT } = require("dns/promises");

exports.feedbackPost = class FeedbackPost{
    constructor(page) {
      this.page = page;
      this.description =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
      this.feedBackLink = this.page.getByRole('link', { name: 'Feedback' })
      this.newFeedBackButton = this.page.locator("#no-feedback")
      this.addNewFeedbackButton = this.page.locator("#add-feedback")
      this.titleInput = this.page.locator('#title')
      this.descriptionEditor = this.page.locator(".ql-editor");
      this.submitButton = this.page.locator('#submit-btn')
      this.statusDropdown = this.page.locator('#feedback-status-select')
}

    async navigateToFeedBack(){
        await this.feedBackLink.click()
    }

    async clickAddNewFeedbackButton() {
        await this.addNewFeedbackButton.click();
      }

      async clickNewFeedBackButton()
      {
        await this.newFeedBackButton.click()
      }

      async getFeedBackPostForm(){
        await this.page.getByText("Create Feedback")
      }
      async fillTitle() {
        const Numeric = await Math.floor(10000 + Math.random() * 90000).toString();
        await this.titleInput.fill(this.title + Numeric);
      }
      async fillTitleWithOnlySpaces() {
        await this.titleInput.fill('    ');
      }

      async fillDescription() {
        await this.descriptionEditor.fill(this.description);
      }
      async selectStatus(optionText) {
        await this.statusDropdown.click(); 
        const optionLocator = this.page.locator(`text=${optionText}`); 
        await optionLocator.click(); 
      }

      async submitFeedBack() {
        await this.submitButton.click()
      }
      async addPosts()
      {
        const maxRetries = 10; 
        const retryInterval = 3000; 
        
        let isAddNewFeedbackButtonVisible = false;
        
        for (let i = 0; i < maxRetries; i++) {
          isAddNewFeedbackButtonVisible = await this.addNewFeedbackButton.isVisible();
          if (isAddNewFeedbackButtonVisible) {
            await this.clickAddNewFeedbackButton();
            break;
          }
          await new Promise(resolve => setTimeout(resolve, retryInterval)); 
        }
        
        if (!isAddNewFeedbackButtonVisible) {
          await this.clickNewFeedBackButton();
        }
      }


     

}



