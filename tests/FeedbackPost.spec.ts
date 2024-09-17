import { LoginPage } from "../e2e/login";
import { validCredentials } from "../e2e/testData/credential";
import { test, expect } from "@playwright/test";
import { feedbackPost } from '../e2e/feedbackPost';

test.beforeEach("verify user able to add release tags", async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto("/");
    await login.login(validCredentials.mail, validCredentials.password);
  });

  test("verify user able to Navigate to Feedback Post page", async ({ page }) => {
    const feedBackPosts = new feedbackPost(page);
    await feedBackPosts.navigateToFeedBack();
   
  });
  test("verify user able to add Posts", async ({ page }) => {
    const feedBackPosts = new feedbackPost(page);
    await feedBackPosts.navigateToFeedBack();
    await feedBackPosts.addPosts();
    await feedBackPosts.fillTitle()
    await feedBackPosts.selectStatus('Planned')
    await feedBackPosts.fillDescription()
    await feedBackPosts.submitFeedBack()
   
  });

  test("verify title field should not accept only spaces", async ({ page }) => {
    const feedBackPosts = new feedbackPost(page);
    await feedBackPosts.navigateToFeedBack();
    await feedBackPosts.addPosts();
    await feedBackPosts.fillTitleWithOnlySpaces()
    await feedBackPosts.fillDescriptionWithOnlyspaces()
    await feedBackPosts.submitFeedBack()
  });

  test("verify user able to delete Posts", async ({ page }) => {
    const feedBackPosts = new feedbackPost(page);
    await feedBackPosts.navigateToFeedBack();
    await feedBackPosts.addPosts();
    await feedBackPosts.fillTitle()
    await feedBackPosts.selectStatus('Planned')
    await feedBackPosts.fillDescription()
    await feedBackPosts.submitFeedBack()
    await feedBackPosts.clickOpenOptions()
    await feedBackPosts.deleteFeedbackPosts()
   
  });

  test("verify user able to Edit Feedback", async ({ page }) => {
    const feedBackPosts = new feedbackPost(page);
    await feedBackPosts.navigateToFeedBack();
    await feedBackPosts.addPosts();
    await feedBackPosts.fillTitle()
    await feedBackPosts.fillDescription()
    await feedBackPosts.selectStatus('Planned')
    await feedBackPosts.fillDescription()
    await feedBackPosts.submitFeedBack()
    await feedBackPosts.clickOpenOptions()
    await feedBackPosts.editFeedbackPost('Public')
    await feedBackPosts.submitFeedBack()
  });
  

  