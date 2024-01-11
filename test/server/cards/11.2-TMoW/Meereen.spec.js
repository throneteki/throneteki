describe('Meereen', function() {
    integration(function() {
        describe('when used multiple time by the same player', function() {
            beforeEach(function() {
                const deck = this.buildDeck('targaryen', [
                    'A Noble Cause',
                    'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)',
                    'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)',
                    'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)',
                    'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.meereen = this.player1.findCardByName('Meereen', 'hand');

                this.player1.clickCard(this.meereen);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickMenu(this.meereen, 'Place hand facedown and draw 3');

                // Manually stand Meereen and trigger it again
                this.player1.clickCard(this.meereen);
                this.player1.clickMenu(this.meereen, 'Place hand facedown and draw 3');

                this.completeMarshalPhase();
                
                // Skip order of discarded cards (for both instances of the ability)
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('Done');
            });

            it('should discard all of the cards placed under Meereen', function() {
                // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/39868-ruling-meereen/
                // 12 cards are placed under Meereen - 9 from the initial
                // hand, another 3 from the draw from the first instance of
                // Meereen. The second set of 3 drawn is discarded, the 12
                // are returned to hand, then they are discarded from the
                // second instance of the ability.
                expect(this.player1Object.hand.length).toBe(0);
                expect(this.player1Object.discardPile.length).toBe(15);
            });
        });

        describe('when used multiple times by multiple players', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('targaryen', [
                    'A Noble Cause',
                    'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)',
                    'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)',
                    'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)',
                    'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)', 'Meereen (TMoW)'
                ]);
                const deck2 = this.buildDeck('greyjoy', [
                    'A Noble Cause',
                    'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)',
                    'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)',
                    'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)',
                    'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)',
                    'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)',
                    'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)', 'Dagmer Cleftjaw (TS)'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.meereen = this.player1.findCardByName('Meereen', 'hand');
                this.dagmer = this.player2.findCardByName('Dagmer Cleftjaw', 'hand');

                this.player1.clickCard(this.meereen);
                this.player2.clickCard(this.dagmer);

                this.completeSetup();
                this.selectFirstPlayer(this.player2);
                this.completeMarshalPhase();

                // Place player 1 cards under Meereen
                this.player1.clickMenu(this.meereen, 'Place hand facedown and draw 3');

                // Take control of Meereen
                this.unopposedChallenge(this.player2, 'Power', this.dagmer);
                this.player2.clickPrompt('Apply Claim');
                this.player2.triggerAbility(this.dagmer);
                this.player2.clickCard(this.meereen);

                // Skip order of discarded cards
                this.player1.clickPrompt('Done');

                // Stand Meereen and place player 2 cards under Meereen
                this.player2.clickCard(this.meereen);
                this.player2.clickMenu(this.meereen, 'Place hand facedown and draw 3');

                this.completeChallengesPhase();

                // Skip order of discarded cards
                this.player2.clickPrompt('Done');
            });

            it('should return the owners cards to hand', function() {
                expect(this.player1Object.hand.length).toBe(9);
                expect(this.player1Object.discardPile.length).toBe(3);
            });

            it('should return the other player\'s cards to hand', function() {
                // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/39868-ruling-meereen/
                // Because the ability text refers to cards "you" placed under
                // Meereen, only your own cards are returned to hand, so it
                // won't end up in a situation where one player's cards are
                // returned to hand before the discard effect.
                expect(this.player2Object.hand.length).toBe(9);
                expect(this.player2Object.discardPile.length).toBe(3);
            });
        });
    });
});
