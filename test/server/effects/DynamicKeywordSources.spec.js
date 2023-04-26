describe('Dynamic keyword sources', function() {
    integration(function() {
        describe('handling loops between Shagwell and Patchface', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'Trading with the Pentoshi',
                    'Shagwell', 'Patchface', 'Moon Boy', 'Maester Wendamyr'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.shagwell = this.player1.findCardByName('Shagwell');
                this.patchface = this.player1.findCardByName('Patchface');
                this.moonboy = this.player1.findCardByName('Moon Boy');
                this.stealthCharacter = this.player1.findCardByName('Maester Wendamyr');

                this.player1.clickCard(this.shagwell);
                this.player1.clickCard(this.patchface);
                this.player1.clickCard(this.moonboy);
                this.player1.clickCard(this.stealthCharacter);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.shagwell.modifyGold(1);
                this.patchface.modifyGold(1);
                this.stealthCharacter.modifyGold(1);

                // Take some harmless action to ensure effects are recalculated after manually adding gold
                this.player1.clickCard(this.stealthCharacter);
            });

            it('spreads the keywords', function() {
                expect(this.shagwell.getKeywords()).toEqual(jasmine.arrayWithExactContents(['bestow (1)', 'insight', 'stealth']));
                expect(this.patchface.getKeywords()).toEqual(jasmine.arrayWithExactContents(['bestow (1)', 'insight', 'stealth']));
            });

            describe('when a keyword source leaves play', function() {
                it('removes the keyword', function() {
                    this.player1.dragCard(this.moonboy, 'discard pile');
                    this.player1.dragCard(this.stealthCharacter, 'discard pile');

                    expect(this.shagwell.getKeywords()).toEqual(jasmine.arrayWithExactContents(['bestow (1)']));
                    expect(this.patchface.getKeywords()).toEqual(jasmine.arrayWithExactContents(['bestow (1)']));
                });
            });

            describe('when a keyword source is no longer valid', function() {
                it('removes the keyword', function() {
                    this.stealthCharacter.modifyGold(-1);
                    this.patchface.modifyGold(-1);
                    // Take some harmless action to ensure effects are recalculated after manually adding gold
                    this.player1.clickCard(this.stealthCharacter);

                    expect(this.shagwell.getKeywords()).toEqual(jasmine.arrayWithExactContents(['bestow (1)']));
                    expect(this.patchface.getKeywords()).toEqual(jasmine.arrayWithExactContents(['bestow (1)', 'insight']));
                });
            });
        });
    });
});
