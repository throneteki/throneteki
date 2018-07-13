@api
Feature: Account API - checkauth endpoint
    Background: Set up the request
        Given I setup an API request

    Scenario: Providing no authentication details should should not be authorised
        When I submit the API request to the 'account/checkauth' endpoint
        Then I should get an unauthorised response

    Scenario: Providing invalid authentication details should not be authorised
        When I set the bearer token to 'aninvalidtoken'
        And I submit the API request to the 'account/checkauth' endpoint
        Then I should get an unauthorised response

    Scenario: Providing a valid token should return success
        When I set valid account details
        And I submit the API request to the 'account/register' endpoint
        And I manually verify the account
        And I set the password to the last registered password
        And I submit the API request to the 'account/login' endpoint
        And I use the currently active token
        And I submit the API request to the 'account/checkauth' endpoint
        Then I should get a successful auth response