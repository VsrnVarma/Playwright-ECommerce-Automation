@ui @checkout @e2e @regression
Feature: End-to-End Checkout Flow

    As a registered shopper on AutomationExercise
    I want to complete the checkout process
    So that I can place orders successfully

    Rule: Logged in user checkouts

        Background:
            Given I am logged in as a registered user

        # ─── Full E2E Checkout ────────────────────────────────────

        @smoke @place-order
        Scenario: Complete E2E checkout flow with payment
            Given I add a product to cart from the products page
            When I navigate to the cart
            And I proceed to checkout
            Then I should see the user registered delivery address on checkout page
            And I should see the order review
            When I add order comment "Please deliver between 9-5pm"
            And I click Place Order
            And I fill payment details with card "Test Cardholder" number "4111111111111111" cvc "123" expiry "12/2028"
            And I confirm the payment
            Then I should see "ORDER PLACED!" confirmation for the order
    
        @place-order
        Scenario: Checkout shows correct address details
            Given I add a product to cart from the products page
            When I navigate to the cart
            And I proceed to checkout
            Then I should see the user registered delivery address on checkout page

        # ─── Negative Checkout ───────────────────────────────────

        @negative @payment
        Scenario: Payment fails with invalid card number
            Given I add a product to cart from the products page
            When I navigate to the cart
            And I proceed to checkout
            And I click Place Order
            And I fill payment details with card "Test User" number "0000000000000000" cvc "000" expiry "01/2020"
            And I confirm the payment
            Then the system should handle the invalid payment gracefully

    Rule: Guest user checkout

        @register-checkout
        Scenario: User registers during checkout and completes order
            Given I am a guest user
            And I add a product to cart from the products page
            When I navigate to the cart
            And I proceed to checkout
            And I click the login option on checkout
            And I initiate signup with a unique name and email
            And I fill the complete registration form
            And I submit the registration
            Then I should see the "ACCOUNT CREATED!" confirmation 
            And I navigate to the cart
            And I proceed to checkout
            And I click Place Order
            And I fill payment details with card "New User" number "4111111111111111" cvc "321" expiry "06/2027"
            And I confirm the payment
            Then I should see "ORDER PLACED!" confirmation for the order