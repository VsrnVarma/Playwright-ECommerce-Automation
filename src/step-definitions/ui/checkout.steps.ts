import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../helpers/CustomWorld";
import { UserRegistrationData } from "../../types";

Given('I am logged in as a registered user', async function (this: CustomWorld) {
    await this.loginPage.goto();
    await this.loginPage.login("testuser1303@example.com", "Password@1303");
});

Given('I add a product to cart from the products page', async function (this: CustomWorld) {
    await this.productsPage.goto();
    await this.productsPage.addToCartByIndex(0);
    await this.productsPage.clickElement(this.productsPage.modalContinueButton);
});

Then('I should see the user registered delivery address on checkout page', async function (this: CustomWorld) {
    await this.checkoutPage.assertCheckoutPageLoaded();
    await this.checkoutPage.assertAddressDetails();
});

Then('I should see the order review', async function (this: CustomWorld) {
    await this.checkoutPage.assertElementVisible(this.checkoutPage.placeOrderButton);
    await this.checkoutPage.assertProductCount();
});

When('I add order comment {string}', async function (this: CustomWorld, comment: string) {
    await this.checkoutPage.addOrderComment(comment);
});

When('I click Place Order', async function (this: CustomWorld) {
    await this.checkoutPage.placeOrder();
});

When('I fill payment details with card {string} number {string} cvc {string} expiry {string}',
    async function (this: CustomWorld, cardName: string, cardNumber: string,
        cvc: string, expiry: string) {
        const [expiryMonth, expiryYear] = expiry.split('/');
        await this.checkoutPage.fillPaymentDetails({
            cardName, cardNumber, cvc, expiryMonth, expiryYear,
        });
    }
);

When('I confirm the payment', async function (this: CustomWorld) {
    await this.checkoutPage.confirmPayment();
});

Then('I should see {string} confirmation for the order',
    async function (this: CustomWorld, message: string) {
        if (message === 'ORDER PLACED!') {
            await this.checkoutPage.assertOrderPlaced();
        }
    }
);

// Negative Checkout
Then('the system should handle the invalid payment gracefully', async function (this: CustomWorld) {
    // System either shows error or processes - should not crash with 500
    await this.checkoutPage.assertInvalidPayment();
});

// Register Checkout
Given('I am a guest user', async function (this: CustomWorld) {
    // Simply navigate to home page without logging in
    await this.homePage.goto();
    await this.homePage.assertHomePageLoaded();
});

When('I click the login option on checkout', async function (this: CustomWorld) {
    // Click the Register/Login link in the modal
    await this.cartPage.clickLoginToCheckout();
    // Should now be on login page
    await this.loginPage.assertUrlContains('/login');
});

