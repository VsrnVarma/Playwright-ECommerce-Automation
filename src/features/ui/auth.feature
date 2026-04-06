@ui @auth @regression
Feature: User Authentication - Login and Registration

  As a user of AutomationExercise
  I want to register, login, and manage my account
  So that I can access all e-commerce features

  Background:
    Given I am on the login page

   # --- Registration Scenarios --------------------

  @smoke @register
  Scenario: Successful new user registration
    And I initiate signup with a unique name and email
    And I fill the complete registration form
    And I submit the registration
    Then I should see the "ACCOUNT CREATED!" confirmation
    When I continue after account creation
    And I should be logged in after registration

  @negative @register
  Scenario: Registration fails with already registered email
    When I initiate signup with existing name "Test User" and email "testuser1303@example.com"
    Then I should see signup error "Email Address already exist!"

  # --- Login Scenarios ---------------------------

  @smoke @login
  Scenario: Successful login with valid credentials
    When I login with email "testuser1303@example.com" and password "Password@1303"
    Then I should be logged in successfully

  @negative @login
  Scenario: Login fails with invalid email
    When I login with email "testuser1403@example.com" and password "Password@1403"
    Then I should see the login error message "Your email or password is incorrect!"
  
  @negative @login
  Scenario: Login fails with wrong password
    When I login with email "testuser1303@example.com" and password "WrongPass999"
    Then I should see the login error message "Your email or password is incorrect!"

  @negative @login
  Scenario: Login fails with empty credentials
    When I click login without entering credentials
    Then the email field should be required
  
  @negative @login
  Scenario Outline: Login fails with invalid email formats
    When I login with email "<email>" and password "Password@1303"
    Then I should see browser email format validation

    Examples:
      | email            |
      | notanemail       |
      | @missinglocal.com |
      | spaces @test.com |

  # --- Logout Scenarios -------------------------

  @smoke @logout
  Scenario: User can logout successfully
    When I login with email "testuser1303@example.com" and password "Password@1303"
    Then I should be logged in successfully
    When I click the logout button
    Then I should be redirected to the login page

  #--Delete Account----------------------

  @delete-account
  Scenario: User to delete already existing account
    When I navigate to the signup section
    And I initiate signup with a unique name and email
    And I fill the complete registration form
    And I submit the registration
    Then I should see the "ACCOUNT CREATED!" confirmation
    When I continue after account creation
    And I click on delete account link
    Then I should see "ACCOUNT DELETED!" confirmation
  
  @intentional-fail @skip
  Scenario: Intentional failure to verify screenshot and trace capture
    Given I am on the login page
    When I login with email "valid@example.com" and password "ValidPass@123"
    Then I should see text "THIS_TEXT_DOES_NOT_EXIST_ON_PAGE"