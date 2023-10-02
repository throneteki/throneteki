describe('Trading With Qohor', function() {
    integration(function() {
        describe('vs Alliance', function() {
            describe('when the player controls an attachment', function() {
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
                    this.deckAttachment = this.player1.findCardByName('Noble Lineage');

                    this.player1.clickCard(this.character);
                    this.player1.clickCard(this.origAttachment);

                    this.completeSetup();

                    this.player1.clickCard(this.origAttachment);
                    this.player1.clickCard(this.character);

                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();
                    
                    // Search effect requires card in deck to actually trigger
                    this.player1.dragCard(this.deckAttachment, 'draw deck');
                });

                it('should allow Trading with Qohor to trigger', function() {
                    this.unopposedChallenge(this.player1, 'Intrigue', this.character);
                    this.player1.clickPrompt('Apply Claim');

                    expect(this.player1).toAllowAbilityTrigger('Trading With Qohor');
                });

                it('should not grant the opponent additional gold', function() {
                    expect(this.player2Object.gold).toBe(5);
                });
            });

            describe('when the player does not control an attachment', function() {
                beforeEach(function() {
                    const deck = this.buildDeck('targaryen', [
                        'Alliance', 'Banner of the Kraken', 'Trading With Qohor',
                        'A Noble Cause',
                        'Hedge Knight'
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();
                    this.selectFirstPlayer(this.player1);
                    this.completeMarshalPhase();
                });

                it('should grant the opponent additional gold', function() {
                    expect(this.player2Object.gold).toBe(6);
                });
            });
        });
    });
});
