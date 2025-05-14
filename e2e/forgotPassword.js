const { expect } = require("@playwright/test");

export class ForgotPassword {
    constructor(page) {
        this.page = page;
        this.forgotPasswordLink = this.page.locator("#forget-password");
        this.emailInput = 'input[id="email"]';
        this.recaptcha = ".recaptcha-checkbox-border";
        this.toastMessage = this.page.locator("//section[@class='Toastify']");
    }

    async createPassword(email, password) {
        await this.page.goto('https://www.yopmail.com/en/');

        await this.page.fill('input#login', email);
        await this.page.click('button[title="Check Inbox @yopmail.com"]');

        await this.page.waitForSelector('iframe#ifinbox', { timeout: 30000 });
        const inboxFrame = await this.page.frame({ name: 'ifinbox' });

        await inboxFrame.waitForSelector('div.m', { timeout: 30000 });
        await inboxFrame.click('div.m');

        await this.page.waitForSelector('iframe#ifmail', { timeout: 30000 });
        const emailFrame = await this.page.frame({ name: 'ifmail' });
        await emailFrame.waitForSelector('a:has-text("Change my password")', { timeout: 30000 });
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            emailFrame.click('a:has-text("Change my password")')
        ]);
        await newPage.locator("#password").fill("Divanshu@1234");
        await newPage.locator("#confirm-password").fill("Divanshu@1234");
        await newPage.getByText("Set Password").click();
        await expect(newPage.locator("//section[@class='Toastify']")).toHaveText(
            "Password reset successfully"
        );
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
