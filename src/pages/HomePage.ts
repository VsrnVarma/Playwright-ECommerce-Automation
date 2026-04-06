import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    // Home page specific locators
    readonly carousel: Locator;
    readonly homeHeading: Locator;
    readonly featuredProducts: Locator;
    readonly productCards: Locator;
    readonly viewProductButtons: Locator;
    readonly addToCartButtons: Locator;
    readonly subscriptionSection: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscribeButton: Locator;
    readonly subscriptionSuccessMessage: Locator;

    // Modal locators
    readonly continueShoppingButton: Locator
    readonly viewCartButton: Locator;
    readonly addedToCartModal: Locator;

    // User-specific elements (after login)
    readonly loggedInUsername: Locator;
    readonly logoutButton: Locator;
    readonly accountDeletedHeading: Locator;
    readonly deleteContinueButton: Locator;

    readonly scrollTop: Locator;

    constructor(page: Page) {
        super(page);

        // Home page elements
        this.carousel = page.locator('.carousel-inner');
        this.homeHeading = page.locator('.features_items h2').filter({ hasText: 'Features Items' });
        this.featuredProducts = page.locator('.features_items');
        this.productCards = page.locator('.features_items .col-sm-4');
        this.viewProductButtons = page.locator('.product-image-wrapper .choose .nav li a');
        this.addToCartButtons = page.locator('.productinfo a.btn.add-to-cart');

        // Subscription
        this.subscriptionSection = page.locator('#footer');
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscribeButton = page.locator('#subscribe');
        this.subscriptionSuccessMessage = page.locator('#success-subscribe .alert-success');

        // Modal Buttons
        this.continueShoppingButton = page.locator('.modal-footer button:has-text("Continue Shopping")').filter({ hasText: 'Continue Shopping' });
        this.viewCartButton = page.locator('a[href="/view_cart"]').filter({ hasText: 'View Cart' });
        this.addedToCartModal = page.locator('#cartModal');

        // User elements
        this.loggedInUsername = page.locator('li a b');
        this.logoutButton = page.locator('a[href="/logout"]');
        this.accountDeletedHeading = page.locator('[data-qa="account-deleted"]');
        this.deleteContinueButton = page.locator('[data-qa="continue-button"]');

        this.scrollTop = this.page.locator('#scrollUp');
    }

    async goto(): Promise<void> {
        await this.navigate('/');
    }

    async scrollToTop(): Promise<void> {
        await this.clickElement(this.scrollTop);
    }

    async assertScrollUp(): Promise<void> {
        const scrollY = await this.page.evaluate(() => window.scrollY);
        expect(scrollY).toBeGreaterThan(500);
    }

    async assertHomePageLoaded(): Promise<void> {
        await this.assertUrlContains('/');
        //await this.assertElementVisible(this.carousel);
    }

    async assertLoggedIn(): Promise<void> {
        await this.assertElementVisible(this.loggedInUsername);
    }

    async assertLoggedInAs(expectedName?: string): Promise<void> {
        if(expectedName){
            await expect(this.loggedInUsername).toContainText(expectedName);
        }
    }

    async getLoggedInUsername(): Promise<string> {
        const text = await this.loggedInUsername.textContent();
        return text?.trim() || '';
    }

    async assertUserLoggedIn(): Promise<void> {
        await this.assertElementVisible(this.loggedInUsername);
    }

    async isLoggedIn(): Promise<boolean> {
        return await this.loggedInUsername.isVisible();
    } 

    async logout(): Promise<void> {
        await this.clickElement(this.logoutButton);
        await this.waitForPageLoad();
    }

    async assertUserLoggedOut(): Promise<void> {
        await this.assertElementVisible(this.loginLink);
        await this.assertElementHidden(this.logoutLink);
    }

    async getProductCount(): Promise<number> {
        return await this.productCards.count();
    }

    async viewProduct(index: number = 0): Promise<void> {
        await this.viewProductButtons.nth(index).click();
        await this.waitForPageLoad();
    }

    async addFirstProductToCart(): Promise<void> {
        await this.addToCartButtons.first().click();
    }

    async addToCart(index: number = 0): Promise<void> {
        await this.addToCartButtons.nth(index).click();
        // Wait for modal or cart update
        //await this.page.waitForTimeout(1000);
    }

    async continueShopping(): Promise<void> {
        await this.waitForElementVisible(this.addedToCartModal);
        await this.clickElement(this.continueShoppingButton);
    }

    async viewCartFromModal(): Promise<void> {
        await this.waitForElementVisible(this.addedToCartModal);
        await this.clickElement(this.viewCartButton);
    }

    async subscribeToNewsletter(email: string): Promise<void> {
        await this.fillInput(this.subscriptionEmailInput, email);
        await this.clickElement(this.subscribeButton);
    }

    async assertSubscriptionSuccess(): Promise<void> {
        await this.assertElementVisible(this.subscriptionSuccessMessage);
        await this.assertTextContent(this.subscriptionSuccessMessage, 
            'You have been successfully subscribed!');
    }

    async assertAccountDeleted(): Promise<void> {
        // await this.assertTextContent(this.accountDeletedHeading, 'ACCOUNT DELETED!');
        await this.assertElementVisible(this.accountDeletedHeading);
        console.log('account deleted heading visible');
        //await expect(this.accountDeletedHeading).toContainText('ACCOUNT DELETED!');
    }

    async clickContinueAfterDeletion(): Promise<void> {
        await this.clickElement(this.deleteContinueButton);
    }

    async subscribeWithEmail(email: string): Promise<void> {
        await this.scrollToElement(this.subscriptionSection);
        await this.subscriptionEmailInput.fill(email);
        await this.subscribeButton.click();
    }
}