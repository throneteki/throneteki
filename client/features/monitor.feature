Feature: Basic monitoring
  Scenario: Check that we can load the site at all
    Given I am on the '/' page
    Then I should see the lobby page with title 'The Iron Throne - Play A Game Of Thrones LCG in your browser'