@ui @products @regression
Feature: Product Browsing and Search

  As a shopper on AutomationExercise
  I want to browse, search, and view products
  So that I can find items I want to purchase

  # ─── Product Listing ─────────────────────────────────────

  @smoke @product-list
  Scenario: Products page loads with all products displayed
    Given I am on the products page
    Then the products page should be displayed
    And I should see a list of products

  @product-list
  Scenario: User can view individual product details
    Given I am on the products page
    When I click on view product for the first product
    Then the product detail page should show name, price, category, availability, condition and brand

  # ─── Search ───────────────────────────────────────────────

  @smoke @search
  Scenario: Successful product search returns results
    Given I am on the products page
    When I search for "top"
    Then I should see "Searched Products" heading
    And all displayed products should be related to "top"
  
  @search
  Scenario: Search for a specific product by exact name
    Given I am on the products page
    When I search for "Blue Top"
    Then I should see "Searched Products" heading
    And I should see a list of products

  @negative @search
  Scenario: Search with no matching results
    Given I am on the products page
    When I search for "xyznonexistentproduct123"
    Then I should see "Searched Products" heading
    And no products should be displayed

  @negative @search
  Scenario: Search with empty string shows all products
    Given I am on the products page
    When I search for ""
    Then I should see a list of products

  @search
  Scenario Outline: Search for various product categories
    Given I am on the products page
    When I search for "<term>"
    Then I should see "Searched Products" heading
    And I should see a list of products

    Examples:
      | term    |
      | tshirt  |
      | jeans   |
      | dress   |
      | top     |

  # ─── Category Filtering ───────────────────────────────────

  @category
  Scenario: Browse Women category products
    Given I am on the products page
    When I click on the "Women" category
    And I select "Dress" subcategory
    Then I should see products in the "Women" "Dress" category

  @category
  Scenario: Browse Men category products
    Given I am on the products page
    When I click on the "Men" category
    And I select "Tshirts" subcategory
    Then I should see products in the "Men" "Tshirts" category

  # ─── Brand Filtering ──────────────────────────────────────

  @brands
  Scenario: Filter products by brand
    Given I am on the products page
    When I click on brand "Polo"
    Then I should see "Polo" brand products

  @brands
  Scenario: Filter products by H&M brand
    Given I am on the products page
    When I click on brand "H&M"
    Then I should see "H&M" brand products

  # ─── Product Review ───────────────────────────────────────

  @review
  Scenario: User can submit a product review
    Given I am on the product detail page for product 1
    When I submit a review with name "Test Reviewer" email "review@test.com" and text "Great product, highly recommended!"
    Then I should see the review success message

