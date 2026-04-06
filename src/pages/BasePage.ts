import { Page, Locator, expect } from '@playwright/test';
import { config } from '../../config/config';

export class BasePage {
    protected page: Page;

    // Common locators for navigation and header elements
    protected readonly logo: Locator;
    protected readonly navigationMenu: Locator;
    protected readonly homeLink: Locator;
    protected readonly productsLink: Locator;
    protected readonly cartLink: Locator;
    protected readonly loginLink: Locator;
    protected readonly contactUsLink: Locator;
    protected readonly logoutLink: Locator;
    protected readonly deleteAccountLink: Locator;

    // Additional common navigation elements
    protected readonly searchInput: Locator;
    protected readonly searchButton: Locator;
    protected readonly userMenu: Locator;
    protected readonly accountLink: Locator;
    protected readonly wishlistLink: Locator;
    protected readonly checkoutLink: Locator;

    // Common UI elements
    protected readonly loadingSpinner: Locator;
    protected readonly successMessage: Locator;
    protected readonly errorMessage: Locator;
    protected readonly alertMessage: Locator;
    protected readonly breadcrumb: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize common locators
        this.logo = page.locator('.logo');
        this.navigationMenu = page.locator('#header .navbar-nav');
        this.homeLink = page.locator('a[href="/"]');
        this.productsLink = page.locator('a[href="/products"]');
        this.cartLink = page.locator('a[href="/view_cart"]');
        this.loginLink = page.locator('a[href="/login"]');
        this.contactUsLink = page.locator('a[href="/contact_us"]');
        this.logoutLink = page.locator('a[href="/logout"]');
        this.deleteAccountLink = page.locator('a[href="/delete_account"]');

        // Additional navigation
        this.searchInput = page.locator('input[name="search"]');
        this.searchButton = page.locator('button[type="submit"]').or(page.locator('#submit_search'));
        this.userMenu = page.locator('.dropdown-toggle');
        this.accountLink = page.locator('a[href="/account"]');
        this.wishlistLink = page.locator('a[href="/wishlist"]');
        this.checkoutLink = page.locator('a[href="/checkout"]');

        // Common UI elements
        this.loadingSpinner = page.locator('.loading, .spinner, [data-loading]');
        this.successMessage = page.locator('.alert-success, .success-message');
        this.errorMessage = page.locator('.alert-danger, .error-message');
        this.alertMessage = page.locator('.alert, .notification');
        this.breadcrumb = page.locator('.breadcrumb, .breadcrumbs');
    }

    // Common actions
    async navigate(path: string = '/'): Promise<void> {
        await this.page.goto(`${config.baseUrl}${path}`,{ 
            waitUntil: 'domcontentloaded',
            timeout: config.navigationTimeout
        });
    }

    async searchForProduct(productName: string): Promise<void> {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickNavItem(item: 'home' | 'products' | 'cart' | 'login' | 'logout' | 'contactUs' | 'deleteAccount'): Promise<void> {
        const map: Record<string, Locator> = {
            home: this.homeLink,
            products: this.productsLink,
            cart: this.cartLink,
            login: this.loginLink,
            logout: this.logoutLink,
            contactUs: this.contactUsLink,
            deleteAccount: this.deleteAccountLink,
        };
        await this.clickElement(map[item]);
        await this.waitForPageLoad();
    }

    async scrollToElement(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    // Common assertions
    async assertPageTitle(expectedTitle: string): Promise<void> {
        await expect(this.page).toHaveTitle(expectedTitle);
    }

    async assertUrlContains(expectedUrlPart: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(expectedUrlPart));
    }

    async assertElementVisible(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
    }

    async assertElementHidden(locator: Locator): Promise<void> {
        await expect(locator).toBeHidden();
    }

    async assertTextContent(locator: Locator, expectedText: string): Promise<void> {
        await expect(locator).toContainText(expectedText);
    }

    async assertNavigationMenuVisible(): Promise<void> {
        await this.assertElementVisible(this.navigationMenu);
    }

    async assertSearchInputVisible(): Promise<void> {
        await this.assertElementVisible(this.searchInput);
    }

    async assertUserMenuVisible(): Promise<void> {
        await this.assertElementVisible(this.userMenu);
    }

    async assertLoadingSpinnerHidden(): Promise<void> {
        await this.assertElementHidden(this.loadingSpinner);
    }

    async assertBreadcrumbVisible(): Promise<void> {
        await this.assertElementVisible(this.breadcrumb);
    }

    // Utility methods
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async waitForNetworkIdle(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    async getPageTitle(): Promise<string> {
        return this.page.title();
    }

    async getElementText(locator: Locator): Promise<string> {
        return await locator.textContent() || '';
    }

    async waitForElementVisible(locator: Locator, timeout?: number): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout: timeout || config.defaultTimeout });
    }

    async waitForElementHidden(locator: Locator, timeout?: number): Promise<void> {
        await locator.waitFor({ state: 'hidden', timeout: timeout || config.defaultTimeout });
    }

    async clickElement(locator: Locator): Promise<void> {
        await locator.click();
    }

    async fillInput(locator: Locator, text: string): Promise<void> {
        await locator.fill(text);
    }

    async selectOption(locator: Locator, value: string): Promise<void> {
        await locator.selectOption(value);
    }

    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `reports/screenshots/${name}.png` });
    }
}