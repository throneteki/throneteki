@api
Feature: Account API - token endpoint
    Background: Set up the request
        Given I setup an API request

    Scenario: Providing no refresh token should error
        When I submit the API request to the 'account/token' endpoint
        Then I should get a 'Refresh token must be specified' failure response

    Scenario: Providing a token with no username should error
        When I supply a refresh token
        And I submit the API request to the 'account/token' endpoint
        Then I should get a 'Invalid token format' failure response

    Scenario: Providing a token with no id should error
        When I supply a refresh token
        And I set the refresh token username to 'unknown user'
        And I submit the API request to the 'account/token' endpoint
        Then I should get a 'Invalid token format' failure response

    Scenario: Providing a token with an invalid username should return a generic error
        When I supply a refresh token
        And I set the refresh token username to 'unknown user'
        And I set the refresh token id to 'someid'
        And I submit the API request to the 'account/token' endpoint
        Then I should get a 'Invalid refresh token' failure response

    Scenario: Providing a token with an existing username but no matching token should return a generic error
        When I supply a refresh token
        And I make sure the 'existinguser' user exists
        And I set the refresh token username to 'existinguser'
        And I set the refresh token id to 'someid'
        And I submit the API request to the 'account/token' endpoint
        Then I should get a 'Invalid refresh token' failure response