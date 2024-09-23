import { LoginPage } from "../e2e/login.js";
import { createProject } from "../e2e/projectsdetails";
import { validCredentials } from "../e2e/testData/credential";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify user able Log in with valid credential",
  async ({ page }) => {
    const login = new LoginPage(page); 
    await page.goto("/");
    await login.login(validCredentials.mail, validCredentials.password);
  }
);
test(" Verify Admin able to create Projet", async ({ page }) => {
  const projects = new createProject(page);
  await projects.createProject();
});
test(" Verify Admin should not able to create project with only spaces", async ({
  page,
}) => {
  const projects = new createProject(page);
  await projects.projectValidationWithEmptyName();
});

test(" Verify Admin should not able to create project with same project which are already exist", async ({
  page,
}) => {
  const projects = new createProject(page);
  await projects.attemptToCreateExistingProject();
});
