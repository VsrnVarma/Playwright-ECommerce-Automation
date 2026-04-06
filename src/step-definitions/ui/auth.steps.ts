import { Given, Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../helpers/CustomWorld";
import { expect } from "@playwright/test";
//import { UserRegistrationData } from "../../types";
import { TestDataFactory } from "../../utils/TestDataFactory";

Given('I am on the login page', async function (this: CustomWorld) {
  await this.loginPage.goto();
  await this.loginPage.assertPageLoaded();
});

// Login Scenarios
When('I login with email {string} and password {string}',
  async function (this: CustomWorld, email: string, password: string) {
    await this.loginPage.login(email, password);
  }
);

Then('I should be logged in successfully', async function (this: CustomWorld) {
  const loggedIn = await this.homePage.isLoggedIn();
  expect(loggedIn).toBeTruthy();
});

Then('I should see the login error message {string}', async function (this: CustomWorld, message: string) {
  await this.loginPage.assertLoginError();
  await expect(this.loginPage.loginError).toContainText(message);
});

When('I click login without entering credentials', async function (this: CustomWorld) {
  await this.loginPage.clickElement(this.loginPage.loginButton);
  await this.page?.waitForLoadState('domcontentloaded');
});

Then('the email field should be required', async function (this: CustomWorld) {
  // Check for validation message or required attribute
  const emailInput = this.loginPage.emailInput;
  const isRequired = await emailInput?.getAttribute('required');
  expect(isRequired).not.toBeNull();
});

Then('I should see browser email format validation', async function (this: CustomWorld) {
  const emailInput = this.loginPage.emailInput;
  const isInvalid = await emailInput?.evaluate(
    (input) => (input as HTMLInputElement).validity.typeMismatch);
  expect(isInvalid).toBeTruthy();
});

// Logout Scenario
When('I click the logout button', async function (this: CustomWorld) {
  await this.homePage.clickNavItem('logout');
});

Then('I should be redirected to the login page', async function (this: CustomWorld) {
  await this.loginPage.assertPageLoaded();
  const loggedIn = await this.homePage.isLoggedIn();
  expect(loggedIn).toBeFalsy();
});

// Signup Scenario
When('I initiate signup with a unique name and email', async function (this: CustomWorld) {
    const user = TestDataFactory.generateUser();
    this.currentUser = user;
    await this.loginPage.initiateSignup(user.name, user.email);
});

When('I fill the complete registration form', async function (this: CustomWorld) {
    if (!this.currentUser) throw new Error('No current user set in world context');
    await this.signupPage.fillRegistrationForm(this.currentUser);
});

When('I submit the registration', async function (this: CustomWorld) {
    await this.signupPage.submitRegistration();
});

Then('I should see the "ACCOUNT CREATED!" confirmation', async function (this: CustomWorld) {
    await this.signupPage.assertAccountCreated();
});

When('I continue after account creation', async function (this: CustomWorld) {
  await this.signupPage.clickContinue();
});

Then('I should be logged in after registration', async function (this: CustomWorld) {
    await this.homePage.assertLoggedIn();
});

When('I initiate signup with existing name {string} and email {string}',
  async function (this: CustomWorld, name: string, email: string) {
    await this.loginPage.initiateSignup(name, email);
  }
);

Then('I should see signup error {string}', async function (this: CustomWorld, message: string) {
  await this.loginPage.assertSignupError();
  await this.loginPage.assertTextContent(this.loginPage.signupError, message);
});

// Delete Account Scenario
When('I navigate to the signup section', async function (this: CustomWorld) {
  await this.loginPage.goto();
});

When('I click on delete account link', async function (this: CustomWorld) {
  await this.homePage.clickNavItem('deleteAccount');
});

Then('I should see "ACCOUNT DELETED!" confirmation', async function (this: CustomWorld) {
    await this.homePage.assertAccountDeleted();
  }
);

// Failed scenario
Then('I should see text {string}', async function (this: CustomWorld, text: string) {
  // This will fail because the text doesn't exist on the page
  await expect(this.page.locator(`text=${text}`))
    .toBeVisible({ timeout: 5000 });
});
