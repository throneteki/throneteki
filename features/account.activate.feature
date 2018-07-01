@api
Feature: Account API - Activate endpoint
    Background: Set up the request
        Given I setup an API request

    Scenario Outline: Missing token or id
        When I set the 'token' to '<token>'
        And I set the 'id' to '<id>'
        And I submit the API request to the 'account/activate' endpoint
        Then I should get a 'Invalid parameters' failure response
        Examples:
            | id                       | token     |
            |                          | sometoken |
            | 123456789012345678901234 |           |
            | invalidid                | sometoken |
            |                          |           |

    Scenario: Id is not found
        When I set the 'token' to 'sometoken'
        And I set the 'id' to '123456789012345678901234'
        And I submit the API request to the 'account/activate' endpoint
        Then I should get a 'An error occured activating your account, check the url you have entered and try again.' failure response

    Scenario: Unexpected activation
        When I set the 'token' to 'sometoken'
        And I set the id to an existing user not expecting validation
        And I submit the API request to the 'account/activate' endpoint
        Then I should get a 'An error occured activating your account, check the url you have entered and try again.' failure response

# Scenario: Activating an expired token
#     When I set the id to an existing user
#     And I set the token to expired
#     And I submit the API request to the 'account/activate' endpoint
    #     Then I should get a 'The activation token you have provided has expired.' failure response

    Scenario: Invalid token
        When I set the id to an existing user
        And I set the 'token' to 'invalidtoken'
        And I submit the API request to the 'account/activate' endpoint
        Then I should get a 'An error occured activating your account, check the url you have entered and try again.' failure response

    Scenario: Valid token for valid user
        When I set the id to an existing user
        And I set the token to the correct token
        And I submit the API request to the 'account/activate' endpoint
        Then The user should be activated