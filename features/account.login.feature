@api
Feature: Account API - login endpoint
    Background: Set up the request
        Given I setup an API request

    Scenario: No username provided should error
        When I submit the API request to the 'account/login' endpoint
        Then I should get a 'You must specify a username' failure response

    Scenario: No password provided should error
        When I set the 'username' to 'someuser'
        And I submit the API request to the 'account/login' endpoint
        Then I should get a 'You must specify a password' failure response

    Scenario: User does not exist should return generic error
        When I set the 'username' to 'someuserthatdoesnotexist'
        And I set the 'password' to 'somepassword'
        And I submit the API request to the 'account/login' endpoint
        Then I should get a 'Invalid username/password' failure response

    Scenario: User exists but password is incorrect should return generic error
        When I set the username to an existing user
        And I set the 'password' to 'wrongpassword'
        And I submit the API request to the 'account/login' endpoint
        Then I should get a 'Invalid username/password' failure response

    Scenario: Valid username and password but not verified should return error
        When I set valid account details
        And I submit the API request to the 'account/register' endpoint
        And I set the password to the last registered password
        And I submit the API request to the 'account/login' endpoint
        Then I should get a 'You must verifiy your account before trying to log in' failure response

    Scenario: Valid username and password but disabled should return generic error
        When I set valid account details
        And I submit the API request to the 'account/register' endpoint
        And I set the password to the last registered password
        And I manually disable the account
        And I submit the API request to the 'account/login' endpoint
        Then I should get a 'Invalid username/password' failure response

    Scenario: Valid username and password and verified should return success
        When I set valid account details
        And I submit the API request to the 'account/register' endpoint
        And I set the password to the last registered password
        And I manually verify the account
        And I submit the API request to the 'account/login' endpoint
        Then I should get a successful login response
