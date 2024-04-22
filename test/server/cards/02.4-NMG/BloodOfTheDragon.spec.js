describe('BloodOfTheDragon', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('stark', [
                'The Long Winter', 'Late Summer Feast',
                'House Manderly Knight'
            ]);
            const deck2 = this.buildDeck('targaryen', [
                'Blood of the Dragon',
                'Expose Duplicity',
                'House Manderly Knight'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.houseManderlyKnight = this.player1.findCardByName('House Manderly Knight', 'hand');
            this.player1.clickCard(this.houseManderlyKnight);

            this.completeSetup();

            this.player1.selectPlot('The Long Winter');
            this.player2.selectPlot('Blood of the Dragon');

            this.selectFirstPlayer(this.player1);
        });

        it('should House Manderly Knight be alive', function() {
            expect(this.houseManderlyKnight.location === 'play area').toBe(true);
        });

        it('should House Manderly Knight have strenght 2', function() {
            expect(this.houseManderlyKnight.getStrength()).toBe(2);
        });

        describe('when new plots are revealed', function() {
            beforeEach(function() {
                //End marshall phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                //End challenge phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
            });

            it('should House Manderly Knight be alive', function() {
                expect(this.houseManderlyKnight.location === 'play area').toBe(true);
            });

            it('should House Manderly Knight have strenght 1', function() {
                expect(this.houseManderlyKnight.getStrength()).toBe(1);
            });
        });
    });
});
