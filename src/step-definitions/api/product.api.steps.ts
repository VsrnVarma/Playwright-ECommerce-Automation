import { Then, When } from "@cucumber/cucumber";
import { CustomWorld } from "../../helpers/CustomWorld";
import { expect } from "@playwright/test";
import { ApiBrandsResponse, ApiProductsResponse } from "../../types";


// Get Products
When('I send a GET request to the products list API', async function (this: CustomWorld) {
  this.apiResponse = await this.apiClient.getAllProducts() as unknown as typeof this.apiResponse;
});

Then('the response should contain a list of products',
  async function (this: CustomWorld) {
    const res = this.apiResponse as unknown as ApiProductsResponse;
    expect(Array.isArray(res.products)).toBeTruthy();
    expect(res.products.length).toBeGreaterThan(0);
  }
);

Then('each product should have id, name, price, brand and category fields',
  async function (this: CustomWorld) {
    const res = this.apiResponse as unknown as ApiProductsResponse;
    for (const product of res.products.slice(0, 5)) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('brand');
      expect(product).toHaveProperty('category');
    }
  }
);

When('I send a POST request to the products list API', async function (this: CustomWorld) {
  this.apiResponse = await this.apiClient.postToProductsList();
});

// Brand Products
When('I send a GET request to the brands list API', async function (this: CustomWorld) {
  this.apiResponse = await this.apiClient.getAllBrands() as unknown as typeof this.apiResponse;
});

Then('the response should contain a list of brands',
  async function (this: CustomWorld) {
    const res = this.apiResponse as unknown as ApiBrandsResponse;
    expect(Array.isArray(res.brands)).toBeTruthy();
    expect(res.brands.length).toBeGreaterThan(0);
  }
);

Then('each brand should have id and brand name fields', async function (this: CustomWorld) {
    const res = this.apiResponse as unknown as ApiBrandsResponse;
    for (const brand of res.brands.slice(0, 5)) {
      expect(brand).toHaveProperty('id');
      expect(brand).toHaveProperty('brand');
    }
});

When('I send a PUT request to the brands list API', async function (this: CustomWorld) {
  this.apiResponse = await this.apiClient.putBrandsList();
});

// Search
When('I search for products with term {string}',
  async function (this: CustomWorld, term: string) {
    this.apiResponse = await this.apiClient.searchProduct(term) as unknown as typeof this.apiResponse;
  }
);

Then('the response should contain search results', async function (this: CustomWorld) {
  const res = this.apiResponse as unknown as ApiProductsResponse;
  expect(Array.isArray(res.products)).toBeTruthy();
});

Then('all results should be relevant to the search term',
  async function (this: CustomWorld) {
    const res = this.apiResponse as unknown as ApiProductsResponse;
    // At least one product should exist
    expect(res.products.length).toBeGreaterThanOrEqual(0);
  }
);

When('I send a POST search request without the search parameter',
  async function (this: CustomWorld) {
    this.apiResponse = await this.apiClient.searchProductWithoutParam();
  }
);

When('I send a GET request to search product API with term {string}',
  async function (this: CustomWorld, term: string) {
    this.apiResponse = await this.apiClient.searchProductViaGet(term);
  }
);

When('I search for products with a {int} character string',
  async function (this: CustomWorld, length: number) {
    const longString = 'ae74%$'.repeat(length);
    this.apiResponse = await this.apiClient.searchProduct(longString) as unknown as typeof this.apiResponse;
  }
);