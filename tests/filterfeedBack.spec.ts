import { LoginPage } from "@/e2e/login";
import { FilterFeedbackstatus } from "@/e2e/filterFeedbackPost";
import { validCredentials } from "@/e2e/testData/credential";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify Admin able to click on newchangelog ",
  async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto("/");
    await page.waitForLoadState('load')
    await login.login(validCredentials.mail, validCredentials.password);
  }
);

test(" Verify user able to filter Feature Requests status", async ({ page }) => {
    const filter = new FilterFeedbackstatus(page);
    await filter.navigateToFeedBack()
    await filter.filterFeatureRequest();
    const feedbackItems = page.locator('#postList');  // Adjust this selector based on your DOM structure
    await page.waitForTimeout(10000)
    const feedbackText = "Feature Request";
    const feedbackContainsText = await feedbackItems.locator(`text=${feedbackText}`).isVisible();
  
    if (feedbackContainsText) {
      console.log(`Feedback contains the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(true);
    } else {
      console.log(`Feedback does NOT contain the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(false);
    }
  });
  
  test("Verify user is able to filter In-review status and check for specific feedback text", async ({ page }) => {
    const filter = new FilterFeedbackstatus(page);
    await filter.navigateToFeedBack();
    await filter.filterInReview();
    const feedbackItems = page.locator('#postList');
    await page.waitForTimeout(10000);
    const feedbackText = "In-Review";
    const feedbackContainsText = await feedbackItems.locator(`text=${feedbackText}`).isVisible();
  
    if (feedbackContainsText) {
      console.log(`Feedback contains the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(true);
    } else {
      console.log(`Feedback does NOT contain the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(false);
    }
  });
  

  test(" Verify user able to filter InProgress status", async ({ page }) => {
    const filter = new FilterFeedbackstatus(page);
    await filter.navigateToFeedBack();
    await filter.filterInProgress();
    const feedbackItems = page.locator('#postList');
    await page.waitForTimeout(10000);
    const feedbackText = "In-Progress";
    const feedbackContainsText = await feedbackItems.locator(`text=${feedbackText}`).isVisible();
  
    if (feedbackContainsText) {
      console.log(`Feedback contains the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(true);
    } else {
      console.log(`Feedback does NOT contain the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(false);
    }
  });
  test(" Verify user able to filter Close status", async ({ page }) => {
     const filter = new FilterFeedbackstatus(page);
    await filter.navigateToFeedBack();
    await filter.filterClosed();
    const feedbackItems = page.locator('#postList');
    await page.waitForTimeout(10000);
    const feedbackText = "Closed";
    const feedbackContainsText = await feedbackItems.locator(`text=${feedbackText}`).isVisible();
  
    if (feedbackContainsText) {
      console.log(`Feedback contains the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(true);
    } else {
      console.log(`Feedback does NOT contain the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(false);
    }
  });
  test(" Verify user able to filter Completed status", async ({ page }) => {
    const filter = new FilterFeedbackstatus(page);
    await filter.navigateToFeedBack();
    await filter.filterCompleted();
    const feedbackItems = page.locator('#postList');
    await page.waitForTimeout(10000);
    const feedbackText = "Completed";
    const feedbackContainsText = await feedbackItems.locator(`text=${feedbackText}`).isVisible();
  
    if (feedbackContainsText) {
      console.log(`Feedback contains the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(true);
    } else {
      console.log(`Feedback does NOT contain the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(false);
    }
  });
  test(" Verify user able to filter Planning status", async ({ page }) => {
    const filter = new FilterFeedbackstatus(page);
    await filter.navigateToFeedBack();
    await filter.filterInProgress();
    const feedbackItems = page.locator('#postList');
    await page.waitForTimeout(10000);
    const feedbackText = "Planned";
    const feedbackContainsText = await feedbackItems.locator(`text=${feedbackText}`).isVisible();
  
    if (feedbackContainsText) {
      console.log(`Feedback contains the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(true);
    } else {
      console.log(`Feedback does NOT contain the text: "${feedbackText}"`);
      expect(feedbackContainsText).toBe(false);
    }
  });
 
 
 
 
 