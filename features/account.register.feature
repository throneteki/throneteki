@api
Feature: Account API - Register endpoint
  Background: Set up the request
    Given I setup an API request

  Scenario: No username provided
    When I submit the API request to the 'account/register' endpoint
    Then I should get a 'You must specify a username' failure response

  Scenario Outline: Invalid usernames
    When I set the 'username' to '<username>'
    And I submit the API request to the 'account/register' endpoint
    Then I should get a '<message>' failure response
    Examples:
      | username               | message                                                                    |
      | ab                     | Username must be at least 3 characters and no more than 15 characters long |
      | thisisatoolongusername | Username must be at least 3 characters and no more than 15 characters long |
      | !nvalid                | Usernames must only use the characters a-z, 0-9, _ and -                   |
      | inv@lid$               | Usernames must only use the characters a-z, 0-9, _ and -                   |
      |                        | You must specify a username                                                |

  Scenario Outline: Invalid email addresses
    When I set the 'username' to 'validusername'
    And I set the 'email' to '<email>'
    And I submit the API request to the 'account/register' endpoint
    Then I should get a '<message>' failure response
    Examples:
      | email                         | message                            |
      | plainaddress                  | Please enter a valid email address |
      | #@%^%#$@#$@#.com              | Please enter a valid email address |
      | @example.com                  | Please enter a valid email address |
      | Joe Smith <email@example.com> | Please enter a valid email address |
      | email.example.com             | Please enter a valid email address |
      | email@example@example.com     | Please enter a valid email address |
      | .email@example.com            | Please enter a valid email address |
      | email.@example.com            | Please enter a valid email address |
      | email..email@example.com      | Please enter a valid email address |
      |                               | You must specify an email address  |

  Scenario: The email address already exists
    When I set the 'username' to 'validusername'
    And I make sure the 'existinguser' user exists
    And I set the 'email' to 'valid@example.com'
    And I set the 'password' to 'validpassword'
    And I submit the API request to the 'account/register' endpoint
    Then I should get a 'An account with that email already exists, please use another' failure response

  Scenario: The username already exists
    When I set the 'username' to 'existinguser'
    And I set the 'email' to 'valid.user@example.com'
    And I set the 'password' to 'validpassword'
    And I submit the API request to the 'account/register' endpoint
    Then I should get a 'An account with that name already exists, please choose another' failure response

  Scenario Outline: Invalid passwords
    When I set the 'password' to '<password>'
    And I set the 'username' to 'validusername'
    And I set the 'email' to 'valid@example.com'
    And I submit the API request to the 'account/register' endpoint
    Then I should get a '<message>' failure response
    Examples:
      | password | message                                |
      | short    | Password must be at least 6 characters |
      |          | You must specify a password            |

  Scenario: Registering an account with valid data
    When I set valid account details
    And I submit the API request to the 'account/register' endpoint
    Then I should get a success message and an account is registered