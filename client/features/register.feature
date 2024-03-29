Feature: The register page
    Background:
        Given I am on the '/register' page

    Scenario Outline: The username field should reject invalid input
        When I enter username: '<Username>'
        And I click the register button
        Then the username error '<Validation Message>' should display
        Examples:
            | Username   | Validation Message                                                         |
            | Inv@l!d    | Usernames must only use the characters a-z, 0-9, _ and -                   |
            | .not-valid | Usernames must only use the characters a-z, 0-9, _ and -                   |
            | ab         | Username must be at least 3 characters and no more than 15 characters long |
            |            | You must specify a username                                                |

    Scenario Outline: The email address field should reject invalid input
        When I enter email address: '<Email>'
        And I click the register button
        Then the email address error '<Validation Message>' should display
        Examples:
            | Email                         | Validation Message                 |
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

    Scenario Outline: The email address field should allow valid input
        When I enter valid registration data
        And I clear the email address field
        And I enter email address: '<Email>'
        And I click the register button
        Then no email address errors should display
        Examples:
            | Email                          |
            | email@example.com              |
            | firstname.lastname@example.com |
            | email@subdomain.example.com    |
            | firstname+lastname@example.com |
            | email@[123.123.123.123]        |
            | 1234567890@example.com         |
            | email@example-one.com          |
            | _______@example.com            |
            | email@example.name             |
            | email@example.museum           |
            | email@example.co.jp            |
            | firstname-lastname@example.com |

    Scenario: The password field should reject passwords that are too short
        When I enter password: 'short'
        And I click the register button
        Then the password error 'Password must be at least 6 characters' should display

    Scenario: The password fields should reject when the passwords do not match
        When I enter password: 'password'
        And I enter the second password: 'differentpassword'
        And I click the register button
        Then the password 1 error 'The passwords you have entered do not match' should display

    Scenario: Entering valid data should register an account
        When I enter valid registration data
        And I click the register button
        Then I should see the 'Your account was successfully registered. Please verify your account using the link in the email sent to the address you have provided.' alert