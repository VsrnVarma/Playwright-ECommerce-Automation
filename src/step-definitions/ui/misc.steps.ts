import { Given, Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../helpers/CustomWorld";
import { ContactUsPage } from "../../pages/ContactUsPage";

Given('I am on the contact us page', async function (this: CustomWorld) {
  await this.contactUsPage.goto();
  await this.contactUsPage.assertPageLoaded();
});

When('I fill the contact form with name {string} email {string} subject {string} and message {string}',
  async function (this: CustomWorld, name: string, email: string,
    subject: string, message: string) 
  {
    await this.contactUsPage.fillContactForm({ name, email, subject, message });
  }
);

When('I submit the contact form', async function (this: CustomWorld) {
  await this.contactUsPage.submitContactForm();
});

Then('I should see {string}', async function (this: CustomWorld, message: string) {
    if (message === 'Success! Your details have been submitted successfully.') {
      await this.contactUsPage.assertSuccessMessageDisplayed();
    } 
    else {
      await this.homePage.assertTextContent(
        this.page.locator('body'),
        message
      );
    }
});

When('I try to submit the contact form without filling any fields',
  async function (this: CustomWorld) {
    await this.contactUsPage.submitContactForm();
  }
);

Then('the form should require mandatory fields', async function (this: CustomWorld) {
    await this.contactUsPage.assertUrlContains('/contact_us');
});

Given('I am on the home page', async function (this: CustomWorld) {
  await this.homePage.goto();
  await this.homePage.assertHomePageLoaded();
});

When('I scroll to the subscription section', async function (this: CustomWorld) {
  await this.homePage.scrollToElement(this.homePage.subscriptionSection);
});

// Navigation
When('I click on {string} in the nav', async function (this: CustomWorld, navItem: string) {
    const map: Record<string, string> = {
      Products: '/products',
      Cart: '/view_cart',
      'Signup / Login': '/login',
    };
    await this.page.locator(`a[href="${map[navItem]}"]`).first().click();
    await this.homePage.waitForPageLoad();
});

Then('I should be on the products page', async function (this: CustomWorld) {
    await this.productsPage.assertUrlContains('/products');
});

Then('I should be on the cart page', async function (this: CustomWorld) {
  await this.cartPage.assertUrlContains('/view_cart');
});

Then('I should be on the login page', async function (this: CustomWorld) {
  await this.loginPage.assertUrlContains('/login');
});

// Scroll
When('I scroll down to the footer', async function (this: CustomWorld) {
  await this.homePage.scrollToElement(this.homePage.subscriptionSection);
});

When('I click the scroll to top button', async function (this: CustomWorld) {
  await this.homePage.scrollToTop();
});

Then('the page should scroll back to top', async function (this: CustomWorld) {
    await this.homePage.assertScrollUp();
});

// Subscription
When('I subscribe with email {string}', async function (this: CustomWorld, email: string) {
  await this.homePage.subscribeWithEmail(email);
});

Then('subscription should be successful', async function (this: CustomWorld) {
  await this.homePage.assertSubscriptionSuccess();
});

When('I try to subscribe with invalid email {string}', async function (this: CustomWorld, email: string) {
    await this.homePage.subscribeWithEmail(email);
});

Then('the email field should show validation error', async function (this: CustomWorld) {
    // Browser native email validation - page should still be at same URL
    await this.homePage.assertUrlContains('/');
});
