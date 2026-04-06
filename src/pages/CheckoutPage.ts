import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { OrderDetails } from '../types';

export class CheckoutPage extends BasePage {

    // Delivery locators
    readonly deliveryAddressSection: Locator;
    readonly billingAddressSection: Locator;
    readonly orderCommentTextarea: Locator;
    readonly placeOrderButton: Locator;
    readonly checkoutProductRows: Locator;

    // Payment locators
    readonly paymentHeading: Locator;
    readonly cardNameInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expiryMonthInput: Locator;
    readonly expiryYearInput: Locator;
    readonly payAndConfirmButton: Locator;

    // Order locators
    readonly orderSuccessAlert: Locator;
    readonly orderSuccessMessage: Locator;
    readonly continueButton: Locator;
    readonly downloadInvoiceButton: Locator;

    constructor(page: Page) {
        super(page);

        this.deliveryAddressSection = page.locator('#address_delivery');
        this.billingAddressSection = page.locator('#address_invoice');
        this.orderCommentTextarea = page.locator('textarea[name="message"]');
        this.placeOrderButton = page.locator('a:has-text("Place Order")');
        this.checkoutProductRows = page.locator('#cart_info tbody tr');

        // Payment
        this.paymentHeading = page.locator('.heading b:has-text("Payment")');
        this.cardNameInput = page.locator('[data-qa="name-on-card"]');
        this.cardNumberInput = page.locator('[data-qa="card-number"]');
        this.cvcInput = page.locator('[data-qa="cvc"]');
        this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
        this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
        this.payAndConfirmButton = page.locator('[data-qa="pay-button"]');

        // Order
        this.orderSuccessAlert = page.locator('h2[data-qa="order-placed"] b');
        this.orderSuccessMessage = page.locator('.order-placed .col-sm-9 p');
        this.continueButton = page.locator('[data-qa="continue-button"]');
        this.downloadInvoiceButton = page.locator('a:has-text("Download Invoice")');
    }

    // Actions
    async assertCheckoutPageLoaded(): Promise<void> {
        await this.assertUrlContains('/checkout');
    }

    async assertAddressDetails(): Promise<void> {
        await this.assertElementVisible(this.deliveryAddressSection);
    }

    async addOrderComment(comment: string): Promise<void> {
        await this.orderCommentTextarea.fill(comment);
    }

    async placeOrder(): Promise<void> {
        await this.placeOrderButton.click();
        await this.waitForPageLoad();
    }

    async fillPaymentDetails(details: OrderDetails): Promise<void> {
        await this.cardNameInput.fill(details.cardName);
        await this.cardNumberInput.fill(details.cardNumber);
        await this.cvcInput.fill(details.cvc);
        await this.expiryMonthInput.fill(details.expiryMonth);
        await this.expiryYearInput.fill(details.expiryYear);
    }

    async confirmPayment(): Promise<void> {
        await this.payAndConfirmButton.click();
        await this.waitForPageLoad();
    }

    async assertOrderPlaced(): Promise<void> {
        await this.assertElementVisible(this.orderSuccessAlert);
    }

    async downloadInvoice(): Promise<void> {
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.downloadInvoiceButton.click(),
        ]);
        await download.saveAs(`reports/invoice_${Date.now()}.pdf`);
    }

    async assertDeliveryAddressContains(text: string): Promise<void> {
        await this.assertTextContent(this.deliveryAddressSection, text);
    }

    async assertProductCount(): Promise<void> {
        const count = await this.checkoutProductRows.count();
        expect(count).toBeGreaterThan(0);
    }

    async assertInvalidPayment(): Promise<void> {
        const url = this.page.url();
        expect(url).not.toContain('500');
        expect(url).not.toContain('error');
    }
}