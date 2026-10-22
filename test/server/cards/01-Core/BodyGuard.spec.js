describe('Bodyguard', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('stark', [
                'A Noble Cause',
                'Valar Morghulis',
                'Catelyn Stark (Core)',
                'Varys (Core)',
                'Bodyguard'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('Catelyn Stark', 'hand');
            this.player1.clickCard(this.character);
            this.player1.clickCard('Bodyguard', 'hand');

            this.player2.clickCard('Varys', 'hand');

            this.completeSetup();

            this.player1.clickCard('Bodyguard', 'play area');
            this.player1.clickCard(this.character);
        });

        describe('when the character would be killed', function () {
            beforeEach(function () {
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('Valar Morghulis');
                this.selectFirstPlayer(this.player1);

                this.player1.triggerAbility('Bodyguard');
            });

            it('should save the character', function () {
                expect(this.character.location).toBe('play area');
            });
        });

        describe('when the character would be discarded from play', function () {
            beforeEach(function () {
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();
                this.completeChallengesPhase();
                this.player2.triggerAbility('Varys');

                this.player1.triggerAbility('Bodyguard');
            });

            it('should save the character', function () {
                expect(this.character.location).toBe('play area');
            });
        });
    });
});
