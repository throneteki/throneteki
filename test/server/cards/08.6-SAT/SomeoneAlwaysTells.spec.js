describe('Someone Always Tells', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('baratheon', [
                'A Noble Cause',
                'Trading with the Pentoshi',
                'Valar Morghulis',
                'Tumblestone Knight',
                'Someone Always Tells'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.knight = this.player1.findCardByName('Tumblestone Knight', 'hand');
            this.player1.clickCard(this.knight);

            this.completeSetup();

            this.player1Object.gold = 2;

            this.player1.selectPlot('A Noble Cause');
        });

        describe('when an opponent reveals a non-cancelable plot when revealed', function () {
            beforeEach(function () {
                this.player2.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player2);
            });

            it('should not prompt to trigger someone always tells', function () {
                expect(this.player1).not.toAllowAbilityTrigger('Someone Always Tells');
            });
        });

        describe('when an opponent reveals a cancelable plot when revealed', function () {
            beforeEach(function () {
                this.player2.selectPlot('Valar Morghulis');
                this.selectFirstPlayer(this.player2);
            });

            it('should prompt to trigger someone always tells', function () {
                expect(this.player1).toAllowAbilityTrigger('Someone Always Tells');
            });

            describe('and when someone always tells is used to cancel', function () {
                beforeEach(function () {
                    this.player1.triggerAbility('Someone Always Tells');
                });

                it('should cancel the when revealed ability', function () {
                    expect(this.knight.location).toBe('play area');
                });
            });
        });
    });
});
