describe('Jousting Pavilion', function () {
    integration(function () {
        describe('with knighted Randyll Tarly', function () {
            beforeEach(function () {
                const deck = this.buildDeck('tyrell', [
                    'Fealty',
                    'A Noble Cause',
                    'Randyll Tarly (Core)',
                    'Knighted',
                    'Jousting Pavilion'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.randyll = this.player1.findCardByName('Randyll Tarly', 'hand');
                this.knighted = this.player1.findCardByName('Knighted', 'hand');
                this.jp = this.player1.findCardByName('Jousting Pavilion', 'hand');

                this.player1.clickCard(this.randyll);
                this.player1.clickCard(this.knighted);
                this.player1.clickCard(this.jp);

                this.completeSetup();
                this.player1.clickCard(this.knighted);
                this.player1.clickCard(this.randyll);
                expect(this.randyll.getStrength()).toBe(6);
            });

            describe('when Randyll Tarly attacks alone', function () {
                beforeEach(function () {
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();

                    this.player1.clickPrompt('Military');
                    this.player1.clickCard(this.randyll);
                    this.player1.clickPrompt('Done');
                });

                it('should trigger his str buff reaction', function () {
                    expect(this.randyll.getStrength()).toBe(7);
                    expect(this.player1).toHavePrompt('Any reactions?');
                    expect(this.randyll.kneeled).toBe(true);
                    this.player1.clickCard(this.randyll);
                    expect(this.randyll.kneeled).toBe(false);
                });
            });
        });
    });
});
