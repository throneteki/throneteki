describe('Gold Cloaks', function () {
    integration(function () {
        describe('when Gold Cloaks is ambushed normally', function () {
            beforeEach(function () {
                const deck = this.buildDeck('thenightswatch', ['A Noble Cause', 'Gold Cloaks']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.character = this.player1.findCardByName('Gold Cloaks', 'hand');

                this.player1.clickCard(this.character);

                this.completeChallengesPhase();
            });

            it('should discard it from play', function () {
                expect(this.character.location).toBe('discard pile');
            });
        });

        describe('when Gold Cloaks is blanked during the phase it is ambushed into play', function () {
            beforeEach(function () {
                const deck = this.buildDeck('thenightswatch', [
                    'A Noble Cause',
                    'Gold Cloaks',
                    'Nightmares'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.character = this.player1.findCardByName('Gold Cloaks', 'hand');

                this.player1.clickCard(this.character);

                // Blank Gold Cloaks to prevent the forced interrupt this phase
                this.player1.clickCard('Nightmares', 'hand');
                this.player1.clickCard(this.character);

                this.completeChallengesPhase();
            });

            it('should not discard it the following phase', function () {
                expect(this.character.location).toBe('play area');
            });
        });
    });
});
