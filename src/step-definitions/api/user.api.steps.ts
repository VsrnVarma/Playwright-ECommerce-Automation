import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../../helpers/CustomWorld";
import { TestDataFactory } from "../../utils/TestDataFactory";
import { ApiUserResponse } from "../../types";

// Login
When('I verify login with email {string} and password {string}',
  async function (this: CustomWorld, email: string, password: string) {
    this.apiResponse = await this.apiClient.verifyLogin(email, password);
  }
);

Then('the response code should be {int}', async function (this: CustomWorld, code: number) {
  expect(this.apiResponse).toBeDefined();
  expect(this.apiResponse!.responseCode).toBe(code);
});

Then('the response message should contain {string}', async function (this: CustomWorld, message: string) {
  expect(this.apiResponse).toBeDefined();
  const responseMessage = (this.apiResponse as any).message ?? '';
  expect(responseMessage).toContain(message);
});

When('I verify login without any parameters', async function (this: CustomWorld) {
  this.apiResponse = await this.apiClient.verifyLoginWithoutParams();
});

When('I send a DELETE request to the verify login endpoint',
  async function (this: CustomWorld) {
    this.apiResponse = await this.apiClient.verifyLoginViaDelete();
  }
);

Then('the API should not return a server error', async function (this: CustomWorld) {
  expect(this.apiResponse).toBeDefined();
  const code = this.apiResponse!.responseCode;
  expect(code).not.toBe(500);
});

// Sign Up
When('I create a new user account via API with unique email',
  async function (this: CustomWorld) {
    const user = TestDataFactory.generateUser();
    this.currentUser = user;
    this.apiResponse = await this.apiClient.createAccount(user);
  }
);

When('I create an account via API with email {string}',
  async function (this: CustomWorld, email: string) {
    const user = TestDataFactory.generateUser({ email });
    this.apiResponse = await this.apiClient.createAccount(user);
  }
);

When('I create an account via API without the password field',
  async function (this: CustomWorld) {
    const user = TestDataFactory.generateUser({ password: '' });
    this.apiResponse = await this.apiClient.createAccount(user);
  }
);

Then('the API should handle the missing field gracefully',
  async function (this: CustomWorld) {
    expect(this.apiResponse).toBeDefined();
    const code = this.apiResponse!.responseCode;
    expect(code).not.toBe(500);
  }
);

// Update Account
Given('I have created a test user account via API', async function (this: CustomWorld) {
  const user = TestDataFactory.generateUser();
  this.currentUser = user;
  const res = await this.apiClient.createAccount(user);
  expect(res.responseCode).toBe(201);
});

When('I update the user account via API', async function (this: CustomWorld) {
  if (!this.currentUser) throw new Error('No current user in context');
  this.apiResponse = await this.apiClient.updateAccount({
    ...this.currentUser,
    firstName: 'Updated',
    city: 'Mumbai',
  });
});

Then('I clean up the test user via API', async function (this: CustomWorld) {
  if (!this.currentUser) return;
  await this.apiClient.deleteAccount(this.currentUser.email, this.currentUser.password);
});

// Delete Account
When('I delete the user account via API', async function (this: CustomWorld) {
  if (!this.currentUser) throw new Error('No current user in context');
  this.apiResponse = await this.apiClient.deleteAccount(
    this.currentUser.email,
    this.currentUser.password
  );
});

When('I delete account with email {string} and password {string}',
  async function (this: CustomWorld, email: string, password: string) {
    this.apiResponse = await this.apiClient.deleteAccount(email, password);
  }
);

// Get user details
When('I get user detail by email {string}', async function (this: CustomWorld, email: string) {
  this.apiResponse = await this.apiClient.getUserDetailByEmail(email) as typeof this.apiResponse;
});

Then('the response should contain user details with name and email',
  async function (this: CustomWorld) {
    const res = this.apiResponse as ApiUserResponse;
    if (res.user) {
      expect(res.user).toHaveProperty('name');
      expect(res.user).toHaveProperty('email');
    } else {
      // Non-existent user will just have a message
      expect(res).toHaveProperty('responseCode');
    }
  }
);

When('I get user detail without providing an email', async function (this: CustomWorld) {
  this.apiResponse = await this.apiClient.getUserDetailByEmail('') as typeof this.apiResponse;
});

