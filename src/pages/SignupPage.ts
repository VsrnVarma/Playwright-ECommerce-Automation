import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../../config/config';
import { UserRegistrationData } from '../types';

export interface UserData {
    title: 'Mr' | 'Mrs';
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
    day: string;
    month: string;
    year: string;
    newsletter?: boolean;
    optin?: boolean;
}

export class SignupPage extends BasePage {
    // Registration form locators
    readonly signupHeading: Locator;
    readonly titleMr: Locator;
    readonly titleMrs: Locator;
    readonly passwordInput: Locator;
    readonly daySelect: Locator;
    readonly monthSelect: Locator;
    readonly yearSelect: Locator;
    readonly newsletterCheckbox: Locator;
    readonly optinCheckbox: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly address1Input: Locator;
    readonly address2Input: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly createAccountButton: Locator;

    // Post-registration
    readonly accountCreatedMessage: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);

        // Registration form
        this.signupHeading = page.locator('.login-form b').filter({ hasText: 'Enter Account Information' });
        this.titleMr = page.locator('#id_gender1');
        this.titleMrs = page.locator('#id_gender2');
        this.passwordInput = page.locator('#password');
        this.daySelect = page.locator('#days');
        this.monthSelect = page.locator('#months');
        this.yearSelect = page.locator('#years');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.optinCheckbox = page.locator('#optin');
        this.firstNameInput = page.locator('#first_name');
        this.lastNameInput = page.locator('#last_name');
        this.companyInput = page.locator('#company');
        this.address1Input = page.locator('#address1');
        this.address2Input = page.locator('#address2');
        this.countrySelect = page.locator('#country');
        this.stateInput = page.locator('#state');
        this.cityInput = page.locator('#city');
        this.zipcodeInput = page.locator('#zipcode');
        this.mobileNumberInput = page.locator('#mobile_number');
        this.createAccountButton = page.locator('[data-qa="create-account"]');

        // Post-registration
        this.accountCreatedMessage = page.locator('h2[data-qa="account-created"]');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async goto(): Promise<void> {
        // Signup page is accessed after initiating signup from login page
        // This method might not be needed, but included for consistency
        await this.navigate('/signup');
    }

    async assertPageLoaded(): Promise<void> {
        await this.assertElementVisible(this.signupHeading);
    }

    async fillRegistrationForm(userData: UserRegistrationData): Promise<void> {
        // Select title
        if (userData.title === 'Mr') {
            await this.titleMr.check();
        } else {
            await this.titleMrs.check();
        }

        // Fill password
        await this.fillInput(this.passwordInput, userData.password);

        // Select DOB
        await this.selectOption(this.daySelect, userData.birthDay);
        await this.selectOption(this.monthSelect, userData.birthMonth);
        await this.selectOption(this.yearSelect, userData.birthYear);

        // Checkboxes
        await this.newsletterCheckbox.check();
        await this.optinCheckbox.check();

        // Personal details
        await this.fillInput(this.firstNameInput, userData.firstName);
        await this.fillInput(this.lastNameInput, userData.lastName);
        if (userData.company) {
            await this.fillInput(this.companyInput, userData.company);
        }
        await this.fillInput(this.address1Input, userData.address1);
        if (userData.address2) {
            await this.fillInput(this.address2Input, userData.address2);
        }
        await this.selectOption(this.countrySelect, userData.country);
        await this.fillInput(this.stateInput, userData.state);
        await this.fillInput(this.cityInput, userData.city);
        await this.fillInput(this.zipcodeInput, userData.zipCode);
        await this.fillInput(this.mobileNumberInput, userData.mobileNumber);
    }

    async submitRegistration(): Promise<void> {
        await this.clickElement(this.createAccountButton);
        console.log('submit button clicked')
        await this.waitForPageLoad();
        console.log('waiting for state load')
    }

    async assertAccountCreated(): Promise<void> {
        await this.assertElementVisible(this.accountCreatedMessage);
    }

    async clickContinue(): Promise<void> {
        await this.clickElement(this.continueButton);
        await this.waitForPageLoad();
    }
}