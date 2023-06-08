describe('Wardens of the East', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('baratheon', [
                'Wardens of the East',
                'A Very Large Shadow', 'A Very Large Shadow', 'A Very Large Shadow'
            ]);
            const deck2 = this.buildDeck('baratheon', [
                'Expose Duplicity',
                'A Very Large Shadow', 'A Very Large Shadow', 'A Very Large Shadow'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.skipSetupPhase();

            this.selectFirstPlayer(this.player1);

            [this.aVeryLargeShadow1, this.aVeryLargeShadow2, this.aVeryLargeShadow3] = this.player1.filterCardsByName('A Very Large Shadow', 'hand');

            this.player1.player.gold = 10;

            this.player1.clickCard(this.aVeryLargeShadow1);
            this.player1.clickCard(this.aVeryLargeShadow2);
        });

        it('should reveal first card marshalled into shadows', function () {
            expect(this.aVeryLargeShadow1.location === 'shadows' && this.game.cardVisibility.isVisible(this.aVeryLargeShadow1, this.player2)).toBe(true);
        });

        it('should reveal cards marshalled into shadows after the first', function () {
            expect(this.aVeryLargeShadow2.location === 'shadows' && this.game.cardVisibility.isVisible(this.aVeryLargeShadow2, this.player2)).toBe(true);
        });

        describe('when card leaves shadows area', function () {
            beforeEach(function () {
                this.player1.clickCard(this.aVeryLargeShadow1);
            });

            it('should hide card going from shadows into hand', function () {
                expect(this.aVeryLargeShadow1.location === 'hand' && this.game.cardVisibility.isVisible(this.aVeryLargeShadow1, this.player2)).toBe(false);
            });

            describe('when card from hand goes back to shadow', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.aVeryLargeShadow1);
                });

                it('card should be revealed again', function () {
                    expect(this.aVeryLargeShadow1.location === 'shadows' && this.game.cardVisibility.isVisible(this.aVeryLargeShadow1, this.player2)).toBe(true);
                });

                describe('when another card is marshalled into shadows', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.aVeryLargeShadow3);
                    });

                    it('card should be revealed', function () {
                        expect(this.aVeryLargeShadow3.location === 'shadows' && this.game.cardVisibility.isVisible(this.aVeryLargeShadow3, this.player2)).toBe(true);
                    });
                });
            });
        });
    });
});
