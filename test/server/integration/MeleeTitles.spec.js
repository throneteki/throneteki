describe('melee titles', function () {
    integration({ gameFormat: 'melee' }, function () {
        describe('selecting titles', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', ['Trading with the Pentoshi', 'Hedge Knight']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.player3.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.completeSetup();

                this.selectFirstPlayer(this.player2);

                // Resolve plot order
                this.selectPlotOrder(this.player1);
                this.selectPlotOrder(this.player2);
            });

            it('should prompt players to select titles in first player order', function () {
                this.player2.selectTitle('Master of Coin');
                this.player3.selectTitle('Master of Laws');
                this.player1.selectTitle('Master of Ships');

                expect(this.player1Object.title.name).toBe('Master of Ships');
                expect(this.player2Object.title.name).toBe('Master of Coin');
                expect(this.player3Object.title.name).toBe('Master of Laws');
            });

            it('should remove previously chosen titles from the prompt', function () {
                this.player2.selectTitle('Master of Coin');
                this.player3.selectTitle('Master of Laws');

                expect(this.player1).toHavePrompt('Select a title');
                expect(this.player1).not.toHavePromptButton('Master of Coin');
                expect(this.player1).not.toHavePromptButton('Master of Laws');
            });
        });

        describe('rival bonuses', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Hedge Knight',
                    'Wildling Horde'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.player3.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Hedge Knight', 'hand');
                this.player1.clickCard('Wildling Horde', 'hand');
                this.player2.clickCard('Hedge Knight', 'hand');
                this.player2.clickCard('Wildling Horde', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.selectTitle('Hand of the King');
                this.player2.selectTitle('Master of Coin');
                this.player3.selectTitle('Master of Ships');

                this.completeMarshalPhase();
            });

            describe('when the attacking player wins', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Military');
                    this.player1.clickPrompt('player2');
                    this.player1.clickCard('Wildling Horde', 'play area');
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player2.clickCard('Hedge Knight', 'play area');
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();
                });

                it('should give the attacking player the bonus', function () {
                    expect(this.player1Object.getTotalPower()).toBe(1);
                });
            });

            describe('when the defending player wins', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Military');
                    this.player1.clickPrompt('player2');
                    this.player1.clickCard('Hedge Knight', 'play area');
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player2.clickCard('Wildling Horde', 'play area');
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();
                });

                it('should give the defending player the bonus', function () {
                    expect(this.player2Object.getTotalPower()).toBe(1);
                });
            });

            describe('when winning against the same rival twice', function () {
                beforeEach(function () {
                    // Challenge 1
                    this.player1.clickPrompt('Military');
                    this.player1.clickPrompt('player2');
                    this.player1.clickCard('Hedge Knight', 'play area');
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player2.clickCard('Hedge Knight', 'play area');
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player1.clickPrompt('Apply Claim');
                    this.player2.clickCard('Hedge Knight', 'play area');

                    // Challenge 2
                    this.player1.clickPrompt('Power');
                    this.player1.clickPrompt('player2');
                    this.player1.clickCard('Wildling Horde', 'play area');
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player2.clickCard('Wildling Horde', 'play area');
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should only give the bonus once per round per opponent', function () {
                    expect(this.player1Object.getTotalPower()).toBe(1);
                });
            });
        });

        describe('supporters', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Hedge Knight',
                    'Wildling Horde'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.player3.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Hedge Knight', 'hand');
                this.player1.clickCard('Wildling Horde', 'hand');
                this.player2.clickCard('Hedge Knight', 'hand');
                this.player2.clickCard('Wildling Horde', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.selectTitle('Hand of the King');
                this.player2.selectTitle('Master of Laws');
                this.player3.selectTitle('Master of Whispers');

                this.completeMarshalPhase();

                this.player1.clickPrompt('Military');
            });

            it('disallows challenges against titles you support', function () {
                expect(this.player1).not.toHavePromptButton('player2');
            });

            it('allows challenges against titles that support you', function () {
                expect(this.player1).toHavePromptButton('player3');
            });
        });
    });
});
