@ui @misc @regression
Feature: Contact Us and Miscellaneous UI

  As a visitor to AutomationExercise
  I want to use support features and navigate the website
  So that I can get help and explore all content

  # ─── Contact Form ─────────────────────────────────────────

  @smoke @contact-form
  Scenario: Submit contact form successfully
    Given I am on the contact us page
    When I fill the contact form with name "Test User" email "test@mailinator.com" subject "Test Query" and message "This is an automated test message for verification"
    And I submit the contact form
    Then I should see "Success! Your details have been submitted successfully."

  @negative @contact-form
  Scenario: Contact form requires all fields
    Given I am on the contact us page
    When I try to submit the contact form without filling any fields
    Then the form should require mandatory fields

 # ─── Subscription ─────────────────────────────────────────

  @smoke @subscription
  Scenario: User can subscribe from the homepage
    Given I am on the home page
    And I subscribe with email "subscriber@mailinator.com"
    Then subscription should be successful

  @negative @subscription
  Scenario: Subscription fails with invalid email
    Given I am on the home page
    And I try to subscribe with invalid email "notanemail"
    Then the email field should show validation error

  # ─── Navigation ──────────────────────────────────────────

  @smoke @navigation
  Scenario: All main navigation links work correctly
    Given I am on the home page
    When I click on "Products" in the nav
    Then I should be on the products page
    When I click on "Signup / Login" in the nav
    Then I should be on the login page
    When I click on "Cart" in the nav
    Then I should be on the cart page

  # ─── Scroll ──────────────────────────────────────────────

  @scroll
  Scenario: Scroll to top button works
    Given I am on the home page
    When I scroll down to the footer
    And I click the scroll to top button
    Then the page should scroll back to top