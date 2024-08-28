const { test, expect } = require("@playwright/test");
const { TIMEOUT } = require("dns/promises");

exports.feedbackPost = class FeedbackPost{
    constructor(page) {
      this.page = page;
      this.feedBackLink = this.page.getByRole('link', { name: 'Feedback' })
      this.newFeedBackButton = this.page.getByRole('button', { name: 'New Feedback' })
      this.addNewFeedbackButton = this.page.getByRole('button', { name: 'Add new' })
}

    async navigateToFeedBack(){
        await this.feedBackLink.click()
    }

    async clickAddNewFeedbackButton() {
        await this.addNewFeedbackButton.click({timeout:5000});
      }

      async clickNewFeedBackButton()
      {
        await this.newFeedBackButton.click({timeout:5000})
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



