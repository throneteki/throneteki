describe('immunity', function () {
    integration(function () {
        describe('when a card has immunity', function () {
            beforeEach(function () {
                const deck = this.buildDeck('lannister', [
                    'Sneak Attack',
                    'Small Council Chamber',
                    'Tywin Lannister (Core)',
                    'Nightmares',
                    'Put to the Torch'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.chamber = this.player1.findCardByName('Small Council Chamber', 'hand');
                this.character = this.player2.findCardByName('Tywin Lannister', 'hand');

                this.player1.clickCard(this.chamber);
                this.player2.clickCard(this.character);

                this.completeSetup();

                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();
            });

            it('should not allow lasting effects to be applied to it', function () {
                this.player2.clickCard('Nightmares', 'hand');
                this.player2.clickCard(this.chamber);

                expect(this.chamber.isAnyBlank()).toBe(false);
            });

            it('should not allow actions to be applied to it', function () {
                this.player2.clickPrompt('Military');
                this.player2.clickCard(this.character);
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickCard('Put to the Torch', 'hand');
                this.player2.clickCard(this.chamber);

                expect(this.chamber.location).toBe('play area');
            });
        });

        describe('triggering the ability of a card that has immunity', function () {
            beforeEach(function () {
                const deck = this.buildDeck('lannister', [
                    'Sneak Attack',
                    'Pleasure Barge',
                    'Pleasure Barge',
                    'Pleasure Barge',
                    'Pleasure Barge',
                    'Pleasure Barge',
                    'Pleasure Barge',
                    'Pleasure Barge',
                    'Pleasure Barge',
                    'Pleasure Barge',
                    'Pleasure Barge',
                    'Pleasure Barge',
                    'Pleasure Barge'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.pleasureBarge = this.player1.findCardByName('Pleasure Barge', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
            });

            describe('when a card is immune to all card effects can trigger an ability', function () {
                beforeEach(function () {
                    // Marshal Pleasure Barge
                    this.player1.clickCard(this.pleasureBarge);
                });

                it('should allow the ability to be triggered', function () {
                    expect(this.player1).toAllowAbilityTrigger(this.pleasureBarge);
                });
            });
        });
    });
});
