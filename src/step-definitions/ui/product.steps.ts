import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "src/helpers/CustomWorld";

Given('I am on the products page', async function (this: CustomWorld) {
  await this.productsPage.goto();
});

Then('the products page should be displayed', async function (this: CustomWorld) {
  await this.productsPage.assertPageLoaded();
});

Then('I should see a list of products', async function (this: CustomWorld) {
  await this.productsPage.assertProductListVisible();
});

When('I click on view product for the first product', async function (this: CustomWorld) {
  await this.productsPage.viewProductByIndex(0);
});

Then('the product detail page should show name, price, category, availability, condition and brand', async function (this: CustomWorld) {
  await this.productsPage.assertProductDetailsLoaded();
});

// Search 
When('I search for {string}', async function (this: CustomWorld, term: string) {
  await this.productsPage.searchForProduct(term);
});

Then('I should see {string} heading', async function (this: CustomWorld, heading: string) {
    if (heading === 'Searched Products') {
      await this.productsPage.assertSearchResultsDisplayed();
    } else {
      await this.productsPage.assertTextContent(
        this.productsPage.productsHeading, heading
      );
    }
});

Then('all displayed products should be related to {string}',
  async function (this: CustomWorld, searchTerm: string) {
    await this.productsPage.assertProductListVisible();
    await this.productsPage.assertProductsContain(searchTerm);
  }
);

Then('no products should be displayed', async function (this: CustomWorld) {
  await this.productsPage.assertNoProductsFound();
});

// Filtering
When('I click on the {string} category',
  async function (this: CustomWorld, category: string) {
    await this.productsPage.filterByCategory(category);
  }
);  

When('I select {string} subcategory', async function (this: CustomWorld, sub: string) {
  await this.productsPage.selectSubCategory(sub);
  await this.productsPage.waitForPageLoad();
});

Then('I should see products in the {string} {string} category',
  async function (this: CustomWorld, text: string, sub: string) {
    await this.productsPage.assertProductListVisible();
    await this.productsPage.assertFilterHeading(text, sub)
  }
);

When('I click on brand {string}', async function (this: CustomWorld, brand: string) {
  await this.productsPage.filterByBrand(brand);
});

Then('I should see {string} brand products', async function (this: CustomWorld, brand: string) {
    await this.productsPage.assertProductListVisible();
    await this.productsPage.assertUrlContains(`brand_products/${brand}`);
});

// Review
Given('I am on the product detail page for product {int}',
  async function (this: CustomWorld, productId: number) {
    await this.productsPage.navigate(`/product_details/${productId}`);
    await this.productsPage.waitForPageLoad();
  }
);

When('I submit a review with name {string} email {string} and text {string}',
  async function (this: CustomWorld, name: string, email: string, text: string) {
    await this.productsPage.submitReview(name, email, text);
  }
);

Then('I should see the review success message', async function (this: CustomWorld) {
  await this.productsPage.assertReviewSubmitted();
});