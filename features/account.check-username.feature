@api
Feature: Account API - check-username endpoint
    Background: Set up the request
        Given I setup an API request

    Scenario: An empty username should return an error
        When I submit the API request to the 'account/check-username' endpoint
        Then I should get a 'You must specify a username' failure response

    Scenario: Username that exists already should return an error message
        When I set the username to an existing user
        And I submit the API request to the 'account/check-username' endpoint
        Then I should get a 'An account with that name already exists, please choose another' failure response

    Scenario: Username that exists already should return an error message
        When I set the username to an existing user
        And I uppercase the username
        And I submit the API request to the 'account/check-username' endpoint
        Then I should get a 'An account with that name already exists, please choose another' failure response

    Scenario: Username that does exist should return success
        When I set the 'username' to 'definitelydoesnotexist'
        And I submit the API request to the 'account/check-username' endpoint
        Then I should get a success response

