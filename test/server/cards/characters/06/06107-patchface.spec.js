describe('Patchface', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('tyrell', [
                'Trading with the Pentoshi',
                'Patchface', 'Moon Boy', 'Motley', 'Renly Baratheon (FFH)'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.patchface = this.player1.findCardByName('Patchface', 'hand');
            this.boy = this.player1.findCardByName('Moon Boy', 'hand');
            this.motley = this.player1.findCardByName('Motley', 'hand');
            this.renly = this.player2.findCardByName('Renly Baratheon (FFH)', 'hand');

            this.player1.clickCard(this.boy);
            this.player2.clickCard(this.renly);

            this.completeSetup();

            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);
        });

        describe('when another fool is in play', function() {
            beforeEach(function() {
                this.player1.clickCard(this.patchface);
            });

            it('should match the keyword', function() {
                expect(this.patchface.hasKeyword('insight')).toBe(true);
            });
        });

        describe('when the fool trait is added to a character', function() {
            beforeEach(function() {
                this.player1.clickCard(this.patchface);
                this.player1.clickCard(this.motley);
                this.player1.clickCard(this.renly);
            });

            it('should match keywords and icons', function() {
                expect(this.patchface.hasIcon('military')).toBe(true);
                expect(this.patchface.hasIcon('intrigue')).toBe(true);
                expect(this.patchface.hasKeyword('insight')).toBe(true);
                expect(this.patchface.hasKeyword('renown')).toBe(true);
            });
        });
    });
});
