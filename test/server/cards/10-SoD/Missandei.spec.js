describe('Missandei', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('targaryen', [
                'A Noble Cause',
                'Missandei',
                'Missandei',
                'Missandei',
                'Missandei',
                'Missandei',
                'Missandei',
                'Missandei',
                'Missandei',
                'Missandei',
                'Missandei',
                'Missandei',
                'Missandei'
            ]);
            const deck2 = this.buildDeck('lannister', ['A Noble Cause', "Ser Gregor's Marauders"]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.opponentPillager = this.player2.findCardByName("Ser Gregor's Marauders", 'hand');

            this.player2.clickCard(this.opponentPillager);

            this.completeSetup();

            this.selectFirstPlayer(this.player2);

            this.completeMarshalPhase();
        });

        describe('when Missandei is discarded from hand', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player2, 'Intrigue', this.opponentPillager);
                this.player2.clickPrompt('Apply Claim');

                this.player1.triggerAbility('Missandei');
            });

            it('should put her into play', function () {
                let missandei = this.player1.findCardByName('Missandei', 'play area');
                expect(!!missandei).toBe(true);
            });
        });

        describe('when Missandei is discarded from deck', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player2, 'Military', this.opponentPillager);
                this.player2.clickPrompt('Apply Claim');

                // No characters to kill
                this.player1.clickPrompt('Done');

                // Pillage occurs, which would discard Missandei from deck
                this.player1.triggerAbility('Missandei');
            });

            it('should put her into play', function () {
                let missandei = this.player1.findCardByName('Missandei', 'play area');
                expect(!!missandei).toBe(true);
            });
        });
    });
});
