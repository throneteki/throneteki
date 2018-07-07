describe('Trading With Qohor', function() {
    integration(function() {
        describe('vs Alliance', function() {
            beforeEach(function() {
                const deck = this.buildDeck('targaryen', [
                    'Alliance', 'Banner of the Kraken', 'Trading With Qohor',
                    'A Noble Cause',
                    'Hedge Knight', 'Little Bird', 'Noble Lineage'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight');
                this.origAttachment = this.player1.findCardByName('Little Bird');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.origAttachment);

                this.completeSetup();

                this.player1.clickCard(this.origAttachment);
                this.player1.clickCard(this.character);

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player1, 'Intrigue', this.character);
                this.player1.clickPrompt('Apply Claim');
            });

            it('should allow Trading with Qohor to trigger', function() {
                expect(this.player1).toAllowAbilityTrigger('Trading With Qohor');
            });
        });
    });
});
