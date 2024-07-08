import { LoginPage } from "../e2e/Login";
import { createproject } from "../e2e/Projectsdetails";
import { test, expect } from "@playwright/test";

test.beforeEach(
  " Verify user able Log in with valid credential",
  async ({ page }) => {
    const login = new LoginPage(page); // 30 seconds
    await page.goto("/");
    await login.login("divanshu@crownstack.com", "Divanshu@123");
  }
);
test(" Verify Admin able to create Projet", async ({ page }) => {
  const projects = new createproject(page);
  await projects.createproject();
});
test(" Verify Admin should not able to create project with only spaces", async ({
  page,
}) => {
  const projects = new createproject(page);
  await projects.projectvalidations();
});

test(" Verify Admin should not able to create project with same project which are already exist", async ({
  page,
}) => {
  const projects = new createproject(page);
  await projects.existproject();
});
