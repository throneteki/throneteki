describe('Alla Tyrell', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('tyrell', [
                'Late Summer Feast',
                'Alla Tyrell', 'Oldtown'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.alla = this.player1.findCardByName('Alla Tyrell');
            this.oldtown = this.player1.findCardByName('Oldtown');

            this.player1.clickCard(this.oldtown);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when Alla Tyrell is revealed from your deck', function() {
            beforeEach(function() {
                this.player1.dragCard(this.alla, 'draw deck');
                this.player1.clickMenu(this.oldtown, 'Reveal top card of deck');
                this.player1.clickPrompt('Character');
            });

            it('should be able to trigger', function() {
                expect(this.player1).toAllowAbilityTrigger(this.alla);
            });

            describe('and she is triggered', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.alla);
                });
                
                it('should put her into play', function() {
                    expect(this.alla.location).toBe('play area');
                });

                it('should still consider to have been revealed', function() {
                    expect(this.player1Object.faction.power).toBe(1);
                });
            });
        });
    });
});
