describe('Patchface', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('tyrell', [
                'Trading with the Pentoshi',
                'Patchface',
                'Moon Boy',
                'Motley',
                'Motley',
                'Renly Baratheon (FFH)',
                'Ser Jaime Lannister (Core)'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.patchface = this.player1.findCardByName('Patchface', 'hand');
            this.boy = this.player1.findCardByName('Moon Boy', 'hand');
            this.motley = this.player1.findCardByName('Motley', 'hand');
            this.motley2 = this.player1.findCardByName('Motley', 'hand');
            this.renly = this.player2.findCardByName('Renly Baratheon (FFH)', 'hand');
            this.jaime = this.player2.findCardByName('Ser Jaime Lannister (Core)', 'hand');

            this.player1.clickCard(this.boy);
            this.player2.clickCard(this.renly);

            this.completeSetup();
        });

        describe('when another fool is in play', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.player1.clickCard(this.patchface);
            });

            it('should match the keyword', function () {
                expect(this.patchface.hasKeyword('insight')).toBe(true);
            });
        });

        describe('when the fool trait is added to a character', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.player1.clickCard(this.patchface);
                this.player1.clickCard(this.motley);
                this.player1.clickCard(this.renly);
            });

            it('should match keywords and icons', function () {
                expect(this.patchface.hasIcon('military')).toBe(true);
                expect(this.patchface.hasIcon('intrigue')).toBe(true);
                expect(this.patchface.hasKeyword('insight')).toBe(true);
                expect(this.patchface.hasKeyword('renown')).toBe(true);
            });
        });

        describe('when the fool trait is added to a character with conditional keywords', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player2);
                this.selectPlotOrder(this.player1);

                this.player2.clickCard(this.jaime);
                this.player2.clickPrompt('Done');

                this.player1.clickCard(this.patchface);
                this.player1.clickCard(this.motley2);
                this.player1.clickCard(this.jaime);
                this.player1.clickPrompt('Done');
            });

            it('should not match keywords and icons if condition is not met even if it is a fool', function () {
                expect(this.jaime.hasTrait('Fool')).toBe(true);
                expect(this.patchface.hasIcon('military')).toBe(true);
                expect(this.patchface.hasIcon('intrigue')).toBe(true);
                expect(this.patchface.hasKeyword('renown')).toBe(false);
            });

            it('should not match keywords and icons if condition is not met', function () {
                this.player2.clickPrompt('Military');
                this.player2.clickCard(this.renly);
                this.player2.clickPrompt('Done');

                expect(this.patchface.hasIcon('military')).toBe(true);
                expect(this.patchface.hasIcon('intrigue')).toBe(true);
                expect(this.patchface.hasKeyword('renown')).toBe(false);
            });

            it('should only match keywords and icons if condition is met', function () {
                this.player2.clickPrompt('Military');
                this.player2.clickCard(this.jaime);
                this.player2.clickPrompt('Done');

                expect(this.patchface.hasIcon('military')).toBe(true);
                expect(this.patchface.hasIcon('intrigue')).toBe(true);
                expect(this.patchface.hasKeyword('renown')).toBe(true);
            });
        });
    });
});
