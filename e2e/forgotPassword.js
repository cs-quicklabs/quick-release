const { expect } = require("@playwright/test");
const MailosaurClient = require("mailosaur");
import dotenv from 'dotenv';
dotenv.config(); // Load variables from .env

const SERVER_ID = process.env.MAILASAUR_SERVERID;
console.log({ env: process.env });
const mailosaur = new MailosaurClient(process.env.MAILOSAUR_API_KEY);

export class ForgotPassword {
    constructor(page) {
        this.page = page;
        this.forgotPasswordLink = this.page.locator("#forget-password");
        this.emailInput = 'input[id="email"]';
        this.recaptcha = ".recaptcha-checkbox-border";
    }

    async clickForgotPassword() {
        await this.forgotPasswordLink.click();
        await expect(this.page.locator("text=Forgot your password?")).toBeVisible();
    }

    async fillEmail(email) {
        const emailField = this.page.locator(this.emailInput);
        await emailField.fill(email);
        await this.page.getByText("Request Password Reset Instructions").click();
    }

    async getResetLink() {
        const email = await mailosaur.messages.get(SERVER_ID, {
            sentTo: `mice-slight@sxelpi2r.mailosaur.net`,
        });

        const resetLink = email.html.links[0].href;
        return resetLink;
    }

    async waitForEmail(email, maxRetries = 10, retryDelay = 5000) {
        let emailMessage;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const email = await mailosaur.messages.list(SERVER_ID, {
                    sentTo: `mice-slight@sxelpi2r.mailosaur.net`,
                    sort: "desc",
                    limit: 1,
                });

                if (emails.items.length > 0) {
                    emailMessage = emails.items[0];
                    return emailMessage;
                }
            } catch {
                console.log(`Retrying... (${i + 1}/${maxRetries})`);
                await this.page.waitForTimeout(retryDelay);
            }
        }

        throw new Error("Failed to retrieve the latest email.");
    }

    async resetPassword(resetLink) {
        await this.page.goto(resetLink);
        await this.page.locator("#password").fill("Divanshu@1234");
        await this.page.locator("#confirm-password").fill("Divanshu@1234");
        await this.page.getByText("Set Password").click();
    }
    async refreshMail() {
        await mailosaur.messages.deleteAll(SERVER_ID);
    }
};
