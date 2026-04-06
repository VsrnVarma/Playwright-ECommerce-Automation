import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    // Login form
    readonly loginHeading: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginError: Locator;

    // Signup form (on the same page)
    readonly signupHeading: Locator;
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;
    readonly signupError: Locator;

    // Post-registration
    readonly accountCreatedMessage: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);

        // Login section
        this.loginHeading = page.locator('.login-form h2');    
        this.emailInput = page.locator('[data-qa="login-email"]');
        this.passwordInput = page.locator('[data-qa="login-password"]');
        this.loginButton = page.locator('button[type="submit"]').first();
        this.loginError = page.locator('.login-form p[style="color: red;"]');

        // Signup section
        this.signupHeading = page.locator('.signup-form h2');
        this.signupNameInput = page.locator('[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('[data-qa="signup-email"]');
        this.signupButton = page.locator('[data-qa="signup-button"]');
        this.signupError = page.locator('.signup-form p[style="color: red;"]');

        // Post-registration
        this.accountCreatedMessage = page.locator('h2[data-qa="account-created"]');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async goto(): Promise<void> {
        await this.navigate('/login');
    }

    async assertPageLoaded(): Promise<void> {
        await this.assertUrlContains('/login');
        await this.assertElementVisible(this.loginHeading);
    }

    async login(email: string, password: string): Promise<void> {
        await this.fillInput(this.emailInput, email);
        await this.fillInput(this.passwordInput, password);
        await this.clickElement(this.loginButton);
        await this.waitForPageLoad();
    }

    async assertLoggedIn(): Promise<void> {
        await this.assertUserLoggedIn();
    }

    async assertLoginError(): Promise<void> {
        await this.assertElementVisible(this.loginError);
        await this.assertTextContent(this.loginError, 'Your email or password is incorrect!');
    }

    async initiateSignup(name: string, email: string): Promise<void> {
        await this.fillInput(this.signupNameInput, name);
        await this.fillInput(this.signupEmailInput, email);
        await this.clickElement(this.signupButton);
        await this.waitForPageLoad();
    }

    async assertSignupError(): Promise<void> {
        await this.assertElementVisible(this.signupError);
        await this.assertTextContent(this.signupError, 'Email Address already exist!');
    }

    // async assertAccountCreated(): Promise<void> {
    //     await this.assertElementVisible(this.accountCreatedMessage);
    // }

    // async clickContinueAfterSignup(): Promise<void> {
    //     await this.clickElement(this.continueButton);
    //     await this.waitForPageLoad();
    // }
}
