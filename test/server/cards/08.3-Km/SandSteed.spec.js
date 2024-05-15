describe('Sand Steed', function () {
    integration(function () {
        describe('when the character would leave play before reactions to placing a Summer plot in used pile', function () {
            beforeEach(function () {
                const deck = this.buildDeck('martell', [
                    'A Song of Summer',
                    'A Noble Cause',
                    'Valar Morghulis',
                    'Hedge Knight',
                    'Sand Steed'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight');
                this.sandSteed = this.player1.findCardByName('Sand Steed');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.sandSteed);

                this.completeSetup();

                this.player1.clickCard(this.sandSteed);
                this.player1.clickCard(this.character);

                this.player1.selectPlot('A Song of Summer');
                this.player2.selectPlot('A Noble Cause');

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('Valar Morghulis');
            });

            it('does not allow Sand Steed to trigger', function () {
                expect(this.player1).not.toAllowAbilityTrigger(this.sandSteed);
                this.selectFirstPlayer(this.player1);
                expect(this.character.location).toBe('dead pile');
                expect(this.player1).not.toAllowAbilityTrigger(this.sandSteed);
            });
        });
    });
});
