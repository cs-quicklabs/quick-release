const { test, expect } = require("@playwright/test");

exports.FilterFeedbackstatus = class FilterFeedbackstatus {
  constructor(page) {
    this.page = page;
    this.status = this.page.locator('#filter-feedback');
    this.feedBackLink = this.page.getByRole('link', { name: 'Feedback' });
    this.addNewFeedbackButton = this.page.locator("#add-feedback");
    this.featureRequest = this.page.getByRole('menuitem', { name: 'Feature Requests' });
    this.inReview = this.page.getByRole('menuitem', { name: 'In-Review' });
    this.planning = this.page.getByRole('menuitem', { name: 'Planned' });
    this.inProgress = this.page.getByRole('menuitem', { name: 'In-progress' });
    this.completed = this.page.getByRole('menuitem', { name: 'Completed' });
    this.closed = this.page.getByRole('menuitem', { name: 'Closed' });
    this.clear = this.page.getByRole('menuitem', { name: 'Clear All' });
  }

  async navigateToFeedBack() {
    await this.feedBackLink.click();
  }

  async applyFilter(statusElement) {
    const maxRetries = 10;
    const retryInterval = 3000;
    let isAddNewFeedbackButtonVisible = false;

    for (let i = 0; i < maxRetries; i++) {
      isAddNewFeedbackButtonVisible = await this.addNewFeedbackButton.isVisible();
      if (isAddNewFeedbackButtonVisible) {
        await this.status.click();
        await statusElement.click();
        break;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }

    if (!isAddNewFeedbackButtonVisible) {
      console.log("Feedback Post not present in this project");
    }
  }

  async filterFeatureRequest() {
    await this.applyFilter(this.featureRequest);
  }

  async filterInReview() {
    await this.applyFilter(this.inReview);
  }

  async filterPlanning() {
    await this.applyFilter(this.planning);
  }

  async filterInProgress() {
    await this.applyFilter(this.inProgress);
  }

  async filterCompleted() {
    await this.applyFilter(this.completed);
  }

  async filterClosed() {
    await this.applyFilter(this.closed);
  }
}
