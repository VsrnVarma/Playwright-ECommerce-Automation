import { UserRegistrationData, OrderDetails, ContactForm } from '../types';

// Simple deterministic data generator (no faker dependency issues)
let counter = Date.now();

function uniqueId(): string {
  return (++counter).toString(36);
}

export class TestDataFactory {
  // Generate a unique user with realistic data
  static generateUser(overrides: Partial<UserRegistrationData> = {}): UserRegistrationData {
    const id = uniqueId();
    return {
      name: `TestUser_${id}`,
      email: `testuser_${id}@mailinator.com`,
      password: 'Test@12345!',
      title: 'Mr',
      firstName: 'John',
      lastName: `Tester_${id}`,
      company: 'AutoTest Corp',
      address1: '123 Automation Street',
      address2: 'Suite 100',
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      zipCode: '500001',
      mobileNumber: '9876543210',
      birthDay: '15',
      birthMonth: 'June',
      birthYear: '1990',
      ...overrides,
    };
  }

  // Generate valid payment / order details
  static generateOrderDetails(overrides: Partial<OrderDetails> = {}): OrderDetails {
    return {
      cardName: 'John Tester',
      cardNumber: '4111111111111111',
      cvc: '123',
      expiryMonth: '12',
      expiryYear: '2028',
      ...overrides,
    };
  }

  // Generate a contact form payload
  static generateContactForm(overrides: Partial<ContactForm> = {}): ContactForm {
    const id = uniqueId();
    return {
      name: `Contact User ${id}`,
      email: `contact_${id}@mailinator.com`,
      subject: `Test Subject ${id}`,
      message: `This is an automated test message sent at ${new Date().toISOString()}`,
      ...overrides,
    };
  }

  // Edge cases

  static generateUserWithEmptyEmail(): UserRegistrationData {
    return this.generateUser({ email: '' });
  }

  static generateUserWithInvalidEmail(): UserRegistrationData {
    return this.generateUser({ email: 'not-an-email' });
  }

  static generateUserWithShortPassword(): UserRegistrationData {
    return this.generateUser({ password: '123' });
  }

  static generateUserWithSpecialCharsName(): UserRegistrationData {
    return this.generateUser({ name: '<script>alert("xss")</script>' });
  }

  static generateUserWithLongName(): UserRegistrationData {
    return this.generateUser({ name: 'A'.repeat(256) });
  }

  static generateUserWithUnicodeData(): UserRegistrationData {
    return this.generateUser({
      firstName: 'Ångström',
      lastName: 'Tëstér',
      city: 'Münïch',
    });
  }

  /**
   * Valid registered test user - must already exist in the system.
   * Used for login tests only (do not delete this user in tests).
   */
  static getExistingUser() {
    return {
      email: 'testuser1303@example.com',
      password: 'Password@1303',
      name: 'AutomationUser',
    };
  }
}
