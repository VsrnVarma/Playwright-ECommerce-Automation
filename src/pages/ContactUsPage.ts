import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ContactForm } from '../types';

export class ContactUsPage extends BasePage {

  readonly pageHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly fileUploadInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);

    // ─── Locators ─────────────────────────────────────────────
    this.pageHeading = this.page.locator('.contact-form h2.title');
    this.nameInput = this.page.locator('[data-qa="name"]');
    this.emailInput = this.page.locator('[data-qa="email"]');
    this.subjectInput = this.page.locator('[data-qa="subject"]');
    this.messageTextarea = this.page.locator('[data-qa="message"]');
    this.fileUploadInput = this.page.locator('input[name="upload_file"]');
    this.submitButton = this.page.locator('[data-qa="submit-button"]');
    this.successMessage = this.page.locator('.status.alert.alert-success');
    this.homeButton = this.page.locator('a:has-text("Home")').first();
  }

  // ─── Actions ──────────────────────────────────────────────
  async goto(): Promise<void> {
    await this.navigate('/contact_us');
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementVisible(this.pageHeading);
    await this.assertTextContent(this.pageHeading, 'Get In Touch');
  }

  async fillContactForm(form: ContactForm): Promise<void> {
    await this.fillInput(this.nameInput, form.name);
    await this.fillInput(this.emailInput, form.email);
    await this.fillInput(this.subjectInput, form.subject);
    await this.fillInput(this.messageTextarea, form.message);
  }

  async submitContactForm(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.clickElement(this.submitButton);
    await this.waitForPageLoad();
  }

  async assertSuccessMessageDisplayed(): Promise<void> {
    await this.assertElementVisible(this.successMessage);
    await this.assertTextContent(
      this.successMessage,
      'Success! Your details have been submitted successfully.'
    );
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.fileUploadInput.setInputFiles(filePath);
  }

  async clickHomeButton(): Promise<void> {
    await this.homeButton.click();
    await this.waitForPageLoad();
  }
}
