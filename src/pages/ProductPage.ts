import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
    readonly productsHeading: Locator;
    readonly productCards: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly productCategories: Locator;
    readonly viewProductButtons: Locator;
    readonly addToCartButtons: Locator;
    readonly overlayAddToCartButtons: Locator;
    readonly noProductsMessage: Locator;
    readonly brandFilters: Locator;
    readonly categoryFilters: Locator;
    // readonly subCategory: Locator;

    // Search locators
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchResultHeading: Locator;

    // Modal locators
    readonly cartModal: Locator;
    readonly modalContinueButton: Locator;
    readonly modalViewCartButton: Locator;

    // Product details locators
    readonly detailsProductName: Locator;
    readonly detailsProductPrice: Locator;
    readonly detailsProductCategory: Locator;
    readonly detailsAvailability: Locator;
    readonly detailsCondition: Locator;
    readonly detailsBrand: Locator;
    readonly detailsQuantity: Locator;
    readonly detailsSizeSelect: Locator;
    readonly detailsColorOptions: Locator;
    readonly detailsAddToCartButton: Locator;

    //Review locators
    readonly writeReviewTab: Locator;
    readonly reviewNameInput: Locator;
    readonly reviewEmailInput: Locator;
    readonly reviewTextarea: Locator;
    readonly submitReviewButton: Locator;
    readonly reviewSuccessAlert: Locator;

    constructor(page: Page) {
        super(page);

        this.productsHeading = page.locator('.features_items h2.title').filter({ hasText: 'All Products' });
        this.productCards = page.locator('.features_items .col-sm-4');
        this.productNames = page.locator('.features_items .productinfo p');
        this.productPrices = page.locator('.productinfo h2');
        this.productCategories = page.locator('.features_items .product-overlay .product-meta');
        this.viewProductButtons = page.locator('a[href^="/product_details/"]');
        this.addToCartButtons = page.locator('.features_items .productinfo a.add-to-cart');
        this.overlayAddToCartButtons = page.locator('.product-overlay a.add-to-cart');
        this.noProductsMessage = page.locator('.features_items .title.text-center:has-text("No Products")');
        this.brandFilters = page.locator('.brands_products .brands-name ul li a');
        this.categoryFilters = page.locator('.left-sidebar .panel-headings');
        // this.subCategory = 

        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.searchResultHeading = page.locator('.features_items .title.text-center');

        this.cartModal = page.locator('#cartModal');
        this.modalContinueButton = page.locator('.modal-footer button:has-text("Continue Shopping")');
        this.modalViewCartButton = page.locator('.modal-footer a[href="/view_cart"]');

        this.detailsProductName = page.locator('.product-information h2');
        this.detailsProductPrice = page.locator('.product-information span span');
        this.detailsProductCategory = page.locator('.product-information p:has-text("Category")');
        this.detailsAvailability = page.locator('.product-information p:has-text("Availability")');
        this.detailsCondition = page.locator('.product-information p:has-text("Condition")');
        this.detailsBrand = page.locator('.product-information p:has-text("Brand")');
        this.detailsQuantity = page.locator('#quantity');
        this.detailsSizeSelect = page.locator('#size');
        this.detailsColorOptions = page.locator('.color-options input, .color-options button');
        this.detailsAddToCartButton = page.locator('button:has-text("Add to cart")');

        this.writeReviewTab = page.locator('a[href="#reviews"]');
        this.reviewNameInput = page.locator('#name');
        this.reviewEmailInput = page.locator('#email');
        this.reviewTextarea = page.locator('#review');
        this.submitReviewButton = page.locator('#button-review');
        this.reviewSuccessAlert = page.locator('#review-section .alert-success');
    }

    async goto(): Promise<void> {
        await this.navigate('/products');
    }

    async assertPageLoaded(): Promise<void> {
        await this.assertUrlContains('/products');
        await this.assertElementVisible(this.productsHeading);
    }

    async getVisibleProductCount(): Promise<number> {
        return await this.productCards.count();
    }

    async assertProductListVisible(): Promise<void> {
        const count = await this.getVisibleProductCount();
        expect(count).toBeGreaterThan(0);
    }

    async assertProductExistsByName(expectedName: string): Promise<void> {
        const locator = this.page.locator('.features_items .productinfo p', { hasText: expectedName });
        await this.assertElementVisible(locator);
    }

    async viewProductByIndex(index: number = 0): Promise<void> {
        await this.viewProductButtons.nth(index).first().click();
        await this.waitForPageLoad();
    }

    async clickViewProductByName(productName: string): Promise<void> {
        const card = this.page.locator('.features_items .col-sm-4').filter({ hasText: productName }).first();
        await card.locator('a:has-text("View Product")').click();
        await this.waitForPageLoad();
    }

    async addToCartByIndex(index: number = 0): Promise<void> {
        //await this.productCards.nth(index).hover();
        await this.addToCartButtons.nth(index).click();
        //await this.waitForElementVisible(this.cartModal);
    }

    async addMultipleProductsToCart(count: number): Promise<void> {
        for (let i = 0; i < count; i++) {
            await this.addToCartByIndex(i);
            await this.modalContinueButton.click();
        }
    }

    async addToCartByName(productName: string): Promise<void> {
        const card = this.page.locator('.features_items .col-sm-4').filter({ hasText: productName }).first();
        await card.locator('a.add-to-cart, button.add-to-cart, a:has-text("Add to cart")').first().click();
        await this.waitForElementVisible(this.cartModal);
    }

    async filterByBrand(brandName: string): Promise<void> {
        await this.brandFilters.filter({ hasText: brandName })
            .first().click();
        await this.waitForPageLoad();
    }

    async filterByCategory(category: string): Promise<void> {
        await this.page.locator(`.left-sidebar .panel-heading a[href="#${category}"]`).first().click();
        // await this.waitForElementVisible(categoryItem);
        // await categoryItem.click();
        await this.waitForPageLoad();
        await this.waitForElementVisible(this.productsHeading);
    }

    async selectSubCategory(sub: string): Promise<void> {
        await this.page.locator(`.panel-body a:has-text("${sub}")`).first().click();
    }

    async searchForProduct(productName: string): Promise<void> {
        await this.fillInput(this.searchInput, productName);
        await this.clickElement(this.searchButton);
        await this.waitForPageLoad();
    }

    async assertSearchResultsDisplayed(): Promise<void> {
        await this.assertElementVisible(this.searchResultHeading);
    }

    async assertNoProductsFound(): Promise<void> {
        //await this.assertElementVisible(this.noProductsMessage);
        const count = await this.getVisibleProductCount();
        expect(count).toBe(0);
    }

    async assertProductsContain(term: string): Promise<void> {
        // Verify at least one product name contains the search term (case insensitive)
        const names = await this.productNames.allTextContents();
        const match = names.some((n) => n.toLowerCase().includes(term.toLowerCase()));
        expect(match).toBeTruthy();
    }

    async assertFilterHeading(term: string, sub: string): Promise<void> {
        await this.assertTextContent(this.searchResultHeading, `${term} - ${sub}`);
    }

    async assertProductDetailsLoaded(): Promise<void> {
        await this.assertElementVisible(this.detailsProductName);
        await this.assertElementVisible(this.detailsProductPrice);
        await this.assertElementVisible(this.detailsProductCategory);
        await this.assertElementVisible(this.detailsAvailability);
        await this.assertElementVisible(this.detailsCondition);
        await this.assertElementVisible(this.detailsBrand);
    }

    async assertProductNameInDetails(expectedName: string): Promise<void> {
        await expect(this.detailsProductName).toHaveText(expectedName);
    }

    async assertProductPriceDisplayed(): Promise<void> {
        await expect(this.detailsProductPrice).not.toBeEmpty();
    }

    async assertProductCategoryDisplayed(): Promise<void> {
        await expect(this.detailsProductCategory).toContainText('Category');
    }

    async assertAvailabilityDisplayed(): Promise<void> {
        await expect(this.detailsAvailability).toContainText('Availability');
    }

    async assertConditionDisplayed(): Promise<void> {
        await expect(this.detailsCondition).toContainText('Condition');
    }

    async assertBrandDisplayed(): Promise<void> {
        await expect(this.detailsBrand).toContainText('Brand');
    }

    async setProductQuantity(quantity = 1): Promise<void> {
        if (quantity > 1) {
            await this.fillInput(this.detailsQuantity, String(quantity));
        }
    }

    async addProductToCartFromDetails(): Promise<void> {
        await this.clickElement(this.detailsAddToCartButton);
        await this.waitForElementVisible(this.cartModal);
    }

    async closeModalContinueShopping(): Promise<void> {
        await this.clickElement(this.modalContinueButton);
        await this.waitForElementHidden(this.cartModal);
    }

    async goToCartFromModal(): Promise<void> {
        await this.clickElement(this.modalViewCartButton);
    }

    async submitReview(name: string, email: string, review: string): Promise<void> {
        await this.writeReviewTab.click();
        await this.reviewNameInput.fill(name);
        await this.reviewEmailInput.fill(email);
        await this.reviewTextarea.fill(review);
        await this.submitReviewButton.click();
    }

    async assertReviewSubmitted(): Promise<void> {
        await this.assertElementVisible(this.reviewSuccessAlert);
    }
}
