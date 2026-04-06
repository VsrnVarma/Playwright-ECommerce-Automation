import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page, webkit, firefox } from '@playwright/test';
import { config } from '../../config/config';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { SignupPage } from '../pages/SignupPage';
import { ApiResponse, UserRegistrationData } from '../types';
import { ContactUsPage } from '../pages/ContactUsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ApiClient } from '../api/ApiClient';

export class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;

    // -- Page Objects -------------------
    homePage!: HomePage;
    loginPage!: LoginPage;
    productsPage!: ProductPage;
    signupPage!: SignupPage;
    cartPage!: CartPage;
    checkoutPage!: CheckoutPage;
    contactUsPage!: ContactUsPage;

    //--API---------------------------------
    apiClient!: ApiClient;

    //-- Shared data
    currentUser?: UserRegistrationData;
    apiResponse?: ApiResponse;
    scenarioName?: string;

    constructor(options: IWorldOptions) {
        super(options);
    }

    /**
     * Launches a browser instance, creates a new context and page,
     * and stores them on the world for later use in step definitions.
     */
    async openBrowser(): Promise<void> {
        const browserType =
            config.browser === 'firefox' ? firefox : config.browser === 'webkit' ? webkit : chromium;
        this.browser = await browserType.launch({
            headless: config.headless,
            slowMo: config.slowMo
        });

        this.context = await this.browser.newContext({
            viewport: {
                width: config.viewportWidth,
                height: config.viewportHeight
            },
            ignoreHTTPSErrors: true,
            recordVideo: config.videoOnFailure ? { dir: 'reports/videos' } : undefined
        });

        if (config.traceOnFailure) {
            await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
        }

        this.page = await this.context.newPage();
        this.page.setDefaultTimeout(config.defaultTimeout);
        this.page.setDefaultNavigationTimeout(config.navigationTimeout);
        this.initPageObjects();
    }

    initPageObjects(): void {
        this.loginPage = new LoginPage(this.page);
        this.signupPage = new SignupPage(this.page);
        this.homePage = new HomePage(this.page);
        this.productsPage = new ProductPage(this.page);
        this.contactUsPage = new ContactUsPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.checkoutPage = new CheckoutPage(this.page);
    }

    async closeBrowser(testFailed: boolean, scenarioName: string = "unknown"): Promise<void> {
        if (testFailed && config.screenshotOnFailure) {
            const safeName = scenarioName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 80);
            await this.page.screenshot({
                path: `reports/screenshots/FAIL_${safeName}_${Date.now()}.png`,
                fullPage: true
            });
        }

        if (config.traceOnFailure && testFailed) {
            const safeName = scenarioName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 80);
            await this.context.tracing.stop({
                path: `reports/traces/FAIL_${safeName}_${Date.now()}.zip`,
            });
        } else if (config.traceOnFailure) {
            await this.context.tracing.stop();
        }

        await this.context.close();
        await this.browser.close();
    }

    async initApiClient(): Promise<void> {
        this.apiClient = new ApiClient();
        await this.apiClient.init();
    }

    async disposeApiClient(): Promise<void> {
        await this.apiClient?.dispose();
    }

}

setWorldConstructor(CustomWorld);
