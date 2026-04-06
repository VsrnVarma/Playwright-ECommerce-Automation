@api @products-api @regression
Feature: Products API

    As an API consumer
    I want to interact with the Products API endpoints
    So that I can retrieve, search, and validate product data

    #---GET All Products------------------------------------

    @smoke @get-products
    Scenario: GET all products return 200 with product list
        When I send a GET request to the products list API
        Then the response code should be 200
        And the response should contain a list of products
        And each product should have id, name, price, brand and category fields

    @negative @get-products
    Scenario: POST to products list returns 405 method not supported
        When I send a POST request to the products list API
        Then the response code should be 405
        And the response message should contain "This request method is not supported"
    
    #---GET All Brands-----------------------------------------

    @smoke @get-brands
    Scenario: GET all brands returns 200 with brands list
        When I send a GET request to the brands list API
        Then the response code should be 200
        And the response should contain a list of brands
        And each brand should have id and brand name fields

    @negative @get-brands
    Scenario: PUT to brands list returns 405 method not supported
        When I send a PUT request to the brands list API
        Then the response code should be 405
        And the response message should contain "This request method is not supported"

    #---Search Products--------------------------------------

    @smoke @search-api
    Scenario: POST search product returns matching products
        When I search for products with term "top"
        Then the response code should be 200
        And the response should contain search results
        And all results should be relevant to the search term

    @search-api
    Scenario Outline: Search API returns results for various keywords
        When I search for products with term "<keyword>"
        Then the response code should be 200
        And the response should contain search results

        Examples:
            | keyword |
            | tshirt  |
            | jeans   |
            | dress   |
            | Blue    |
        
    @negative @search-api
    Scenario: POST search without search_product param returns 400
        When I send a POST search request without the search parameter
        Then the response code should be 400
        And the response message should contain "Bad request, search_product parameter is missing"

    @negative @search-api
    Scenario: GET search product returns 405
        When I send a GET request to search product API with term "top"
        Then the response code should be 405
        And the response message should contain "This request method is not supported"

    @negative @search-api
    Scenario: Search with empty string returns response
        When I search for products with term ""
        Then the response code should be 200

    @edge-case @search-api
    Scenario: Search with special characters handles gracefully
        When I search for products with term "<script>alert(1)</script>"
        Then the response code should be 200
        And the API should not return a server error

    @edge-case @search-api
    Scenario: Search with very long string handles gracefully
        When I search for products with a 500 character string
        Then the response code should be 200
        And the API should not return a server error
