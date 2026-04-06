import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
    readonly cartHeading: Locator;
    readonly cartRows: Locator;
    readonly cartProductNames: Locator;
    readonly cartProductPrices: Locator;
    readonly cartProductQuantities: Locator;
    readonly cartProductTotals: Locator;
    readonly removeItemButtons: Locator;
    readonly proceedToCheckoutButton: Locator;
    readonly loginToCheckoutLink: Locator;
    readonly emptyCartMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.cartHeading = page.locator('#cart_items h2.heading');
        this.cartRows = page.locator('#cart_info_table tbody tr');
        this.cartProductNames = page.locator('.cart_description h4 a');
        this.cartProductPrices = page.locator('.cart_price p');
        this.cartProductQuantities = page.locator('.cart_quantity button');
        this.cartProductTotals = page.locator('.cart_total p.cart_total_price');
        this.removeItemButtons = page.locator('.cart_quantity_delete');
        this.proceedToCheckoutButton = page.locator('.btn:has-text("Proceed To Checkout")');
        this.loginToCheckoutLink = page.locator('a:has-text("Register / Login")');
        this.emptyCartMessage = page.locator('#empty_cart p');
    }

    //---Actions-------------------------
    async goto(): Promise<void> {
        await this.navigate('/view_cart');
    }

    async assertCartLoaded(): Promise<void> {
        await this.assertUrlContains('/view_cart');
    }

    async assertCartHasProducts(): Promise<void> {
        const count = await this.cartRows.count();
        expect(count).toBeGreaterThan(0);
    }

    async assertCartIsEmpty(): Promise<void> {
        await this.assertElementVisible(this.emptyCartMessage);
    }

    async assertCartItemCount(count: number): Promise<void> {
        await expect(this.cartRows).toHaveCount(count);
    }

    async assertProductInCart(productName: string): Promise<void> {
        const names = await this.cartProductNames.allTextContents();
        const found = names.some((n) => n.toLowerCase().includes(productName.toLowerCase()));
        expect(found).toBeTruthy();
    }

    async removeProductByIndex(index: number): Promise<void> {
        await this.removeItemButtons.nth(index).click();
        await this.page.waitForTimeout(1000);
    }

    async removeAllProducts(): Promise<void> {
        const count = await this.removeItemButtons.count();
        for (let i = 0; i < count; i++) {
            await this.removeItemButtons.first().click();
            await this.page.waitForTimeout(800);
        }
    }

    async getCartItemCount(): Promise<number> {
        return await this.cartRows.count();
    }

    async getProductQuantity(rowIndex: number): Promise<string> {
        return (await this.cartProductQuantities.nth(rowIndex).textContent()) ?? '';
    }

    async assertProductQuantity(rowIndex: number = 0, expectedQty: string): Promise<void> {
        await expect(this.cartProductQuantities.nth(rowIndex)).toHaveText(expectedQty);
    }

    async proceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
    }

    async clickLoginToCheckout(): Promise<void> {
        await this.loginToCheckoutLink.click();
        await this.waitForPageLoad();
    }
}