import { Given, Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../helpers/CustomWorld";
import { expect } from "@playwright/test";

// Add to Cart
When('I add the first product to the cart', async function (this: CustomWorld) {
  await this.homePage.addFirstProductToCart();
});

When('I continue shopping', async function (this: CustomWorld) {
  await this.homePage.continueShopping();
});

When('I navigate to the cart', async function (this: CustomWorld) {
  await this.cartPage.goto();
  await this.cartPage.assertCartLoaded();
});

Then('the cart should contain {int} product', async function (this: CustomWorld, count: number) {
  await this.cartPage.assertCartItemCount(count);
});

When('I add {int} products to the cart', async function (this: CustomWorld, count: number) {
  await this.productsPage.addMultipleProductsToCart(count);
});

Then('the cart should contain {int} products', async function (this: CustomWorld, count: number) {
  await this.cartPage.assertCartItemCount(count);
});

When('I set the quantity to {int}', async function (this: CustomWorld, count: number) {
  await this.productsPage.setProductQuantity(count);
});

When('I add the product to cart', async function (this: CustomWorld) {
  await this.productsPage.addProductToCartFromDetails();
});

Then('The cart should show quantity {int} for the product', 
    async function(this: CustomWorld, count: number) {
        await this.cartPage.assertProductQuantity(0,count.toString());
    }
);

// View Cart from Modal
When('I view cart from the modal', async function (this: CustomWorld) {
  await this.homePage.viewCartFromModal();
});

Then('the cart page should be displayed', async function (this: CustomWorld) {
  await this.cartPage.assertCartLoaded();
});

Then('the cart should have product names, prices, quantities and totals',
  async function (this: CustomWorld) {
    await this.cartPage.assertCartHasProducts();
    await this.cartPage.assertElementVisible(this.cartPage.cartProductNames.first());
    await this.cartPage.assertElementVisible(this.cartPage.cartProductPrices.first());
    await this.cartPage.assertElementVisible(this.cartPage.cartProductQuantities.first());
    await this.cartPage.assertElementVisible(this.cartPage.cartProductTotals.first());
  }
);

// Remove Products from Cart
When('I remove the first product from cart', async function (this: CustomWorld) {
    await this.cartPage.removeProductByIndex(0);
});

When('I remove all products from cart', async function (this: CustomWorld) {
  await this.cartPage.removeAllProducts();
});

Then('the cart should be empty', async function (this: CustomWorld) {
  await this.cartPage.waitForPageLoad();
  await this.cartPage.assertCartIsEmpty();
});

// Checkout Re-direct
When('I proceed to checkout', async function (this: CustomWorld) {
  await this.cartPage.proceedToCheckout();
});

Then('I should see a {string} option', async function (this: CustomWorld, text: string) {
    if (text === 'Register / Login') {
      await this.cartPage.assertElementVisible(this.cartPage.loginToCheckoutLink);
    }
});

// Edge
Given('I am on the cart page directly', async function (this: CustomWorld) {
  await this.cartPage.goto();
});
