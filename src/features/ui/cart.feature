@ui @cart @regression
Feature: Shopping Cart Management

  As a shopper on AutomationExercise
  I want to add, view, and manage items in my cart
  So that I can prepare my order before checkout

  # ─── Add to Cart ──────────────────────────────────────────

  @smoke @add-to-cart
  Scenario: Add a product to cart from homepage
    Given I am on the products page
    When I add the first product to the cart
    And I continue shopping
    And I navigate to the cart
    Then the cart should contain 1 product

  @add-to-cart
  Scenario: Add multiple products to cart
    Given I am on the products page
    When I add 2 products to the cart
    And I navigate to the cart
    Then the cart should contain 2 products

  @add-to-cart @detail
  Scenario: Add product with specific quantity from product detail
    Given I am on the product detail page for product 2
    When I set the quantity to 4
    And I add the product to cart
    And I navigate to the cart
    Then The cart should show quantity 4 for the product

  # ─── View Cart ────────────────────────────────────────────

  @smoke @view-cart
  Scenario: Cart page displays correct product details
    Given I am on the home page
    When I add the first product to the cart
    And I view cart from the modal
    Then the cart page should be displayed
    And the cart should have product names, prices, quantities and totals

  # ─── Remove from Cart ─────────────────────────────────────

  @remove-from-cart
  Scenario: Remove a product from cart
    Given I am on the home page
    When I add the first product to the cart
    And I continue shopping
    And I navigate to the cart
    Then the cart should contain 1 product
    When I remove the first product from cart
    Then the cart should be empty

  @remove-from-cart
  Scenario: Cart shows empty state after removing all items
    Given I am on the products page
    When I add 2 products to the cart
    And I navigate to the cart
    When I remove all products from cart
    Then the cart should be empty

  # ─── Checkout Redirect ────────────────────────────────────

  @checkout-redirect
  Scenario: Logged out user is prompted to login before checkout
    Given I am on the home page
    When I add the first product to the cart
    And I continue shopping
    And I navigate to the cart
    And I proceed to checkout
    Then I should see a "Register / Login" option

  # ─── Edge Cases ───────────────────────────────────────────

  @negative @cart
  Scenario: Cart page shows empty state when no products added
    Given I am on the cart page directly
    Then the cart should be empty

  @subscription
  Scenario: User can subscribe from cart page
    Given I am on the cart page directly
    When I subscribe with email "cartsub@mailinator.com"
    Then subscription should be successful