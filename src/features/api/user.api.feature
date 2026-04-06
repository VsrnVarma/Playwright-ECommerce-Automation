@api @user-api @regression
Feature: User Account and Authentication API

  As an API consumer
  I want to create, verify, update, and delete user accounts
  So that I can manage the full user lifecycle via API

  #---Verify login-------------------------------------------

  @smoke @verify-login-api
  Scenario: POST verify login with valid credentials returns user exists
    When I verify login with email "testuser1303@example.com" and password "Password@1303"
    Then the response code should be 200
    And the response message should contain "User exists!"

  @negative @verify-login-api
  Scenario: POST verify login with invalid credentials returns user not found
    When I verify login with email "nonexistent_xyz@fake.com" and password "wrongpass"
    Then the response code should be 404
    And the response message should contain "User not found!"
  
  @negative @verify-login-api
  Scenario: POST verify login without email parameter returns 400
    When I verify login without any parameters
    Then the response code should be 400
    And the response message should contain "Bad request, email or password parameter is missing"

  @negative @verify-login-api
  Scenario: DELETE to verify login returns 405
    When I send a DELETE request to the verify login endpoint
    Then the response code should be 405
    And the response message should contain "This request method is not supported"

  @edge-case @verify-login-api
  Scenario: Verify login with special character email
    When I verify login with email "test+user@example.com" and password "pass123"
    Then the response code should be 404
    And the API should not return a server error  

  @edge-case @verify-login-api
  Scenario: Verify login with SQL injection attempt
    When I verify login with email "' OR 1=1 --" and password "' OR 1=1 --"
    Then the response code should be 404
    And the API should not return a server error

  #---Create Account-----------------------------------------

  @smoke @create-account-api
  Scenario: POST create account with valid data returns user created
    When I create a new user account via API with unique email
    Then the response code should be 201
    And the response message should contain "User created!"

  @negative @create-account-api
  Scenario: POST create account with already registered email returns error
    When I create an account via API with email "testuser1303@example.com"
    Then the response code should be 400
    And the response message should contain "Email already exists!"

  @edge-case @create-account-api
  Scenario: POST create account with missing required fields
    When I create an account via API without the password field
    Then the response code should be 201
    And the API should handle the missing field gracefully

  #---Update Account----------------------------------------- 

  @update-account-api
  Scenario: PUT update user account with valid data
    Given I have created a test user account via API
    When I update the user account via API
    Then the response code should be 200
    And the response message should contain "User updated!"
    And I clean up the test user via API

  #---Delete Account--------------------------------------

  @delete-account-api
  Scenario: DELETE account with valid credentials removes user
    Given I have created a test user account via API
    When I delete the user account via API
    Then the response code should be 200
    And the response message should contain "Account deleted!"

  @negative @delete-account-api
  Scenario: DELETE account with invalid credentials
    When I delete account with email "notregistered@fake.com" and password "badpass"
    Then the response code should be 404
    And the response message should contain "Account not found!"

  #---Get User Detail-------------------------------------------

  @smoke @get-user-api
  Scenario: GET user detail by email returns user data
    When I get user detail by email "testuser1303@example.com"
    Then the response code should be 200
    And the response should contain user details with name and email

  @negative @get-user-api
  Scenario: GET user detail for non-existent email returns not found
    When I get user detail by email "doesnotexist_xyz@fake.com"
    Then the response code should be 404
    And the response message should contain "Account not found with this email"

  @edge-case @get-user-api
  Scenario: GET user detail without email parameter
    When I get user detail without providing an email
    Then the response code should be 200
    And the API should handle the missing field gracefully

  