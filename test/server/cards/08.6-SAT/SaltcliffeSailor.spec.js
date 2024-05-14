describe('Saltcliffe Sailor', function () {
    integration(function () {
        describe('stealth ability', function () {
            beforeEach(function () {
                const deck = this.buildDeck('greyjoy', [
                    'Trading with the Pentoshi',
                    'Saltcliffe Sailor',
                    'Wex Pyke'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.saltcliffeSailor = this.player1.findCardByName('Saltcliffe Sailor', 'hand');
                this.bestowCharacter = this.player1.findCardByName('Wex Pyke', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);
            });

            describe('when Saltcliffe Sailor has no gold', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.saltcliffeSailor);
                    // Skip Bestow
                    this.player1.clickPrompt('Done');
                });

                it('should not gain stealth', function () {
                    expect(this.saltcliffeSailor.hasKeyword('Stealth')).toBe(false);
                });
            });

            describe('when Saltcliffe Sailor has gold', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.saltcliffeSailor);
                    // Bestow 1 gold
                    this.player1.clickPrompt('1');
                });

                it('should gain stealth', function () {
                    expect(this.saltcliffeSailor.hasKeyword('Stealth')).toBe(true);
                });
            });

            describe('when new characters have no gold', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.saltcliffeSailor);
                    // Skip Bestow
                    this.player1.clickPrompt('Done');

                    this.player1.clickCard(this.bestowCharacter);
                    // Skip Bestow
                    this.player1.clickPrompt('Done');
                });

                it('should not gain stealth', function () {
                    expect(this.bestowCharacter.hasKeyword('Stealth')).toBe(false);
                });
            });

            describe('when new characters have gold', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.saltcliffeSailor);
                    // Skip Bestow
                    this.player1.clickPrompt('Done');

                    this.player1.clickCard(this.bestowCharacter);
                    // Bestow 1 gold
                    this.player1.clickPrompt('1');
                });

                it('should gain stealth', function () {
                    expect(this.bestowCharacter.hasKeyword('Stealth')).toBe(true);
                });
            });

            describe('when existing characters have gold', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.bestowCharacter);
                    // Bestow 1 gold
                    this.player1.clickPrompt('1');

                    this.player1.clickCard(this.saltcliffeSailor);
                    // Skip Bestow
                    this.player1.clickPrompt('Done');
                });

                it('should gain stealth', function () {
                    expect(this.bestowCharacter.hasKeyword('Stealth')).toBe(true);
                });
            });
        });
    });
});
