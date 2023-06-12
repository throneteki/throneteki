describe('Wardens of the East', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('baratheon', [
                'Wardens of the East',
                'A Very Large Shadow', 'A Very Large Shadow', 'A Very Large Shadow'
            ]);
            const deck2 = this.buildDeck('baratheon', [
                'Expose Duplicity',
                'A Very Large Shadow', 'A Very Large Shadow', 'Sweetrobin'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.skipSetupPhase();

            this.selectFirstPlayer(this.player1);

            [this.aVeryLargeShadow11, this.aVeryLargeShadow12, this.aVeryLargeShadow13] = this.player1.filterCardsByName('A Very Large Shadow', 'hand');
            [this.aVeryLargeShadow21, this.aVeryLargeShadow22] = this.player2.filterCardsByName('A Very Large Shadow', 'hand');
            [this.sweetRobin] = this.player2.filterCardsByName('Sweetrobin', 'hand');

            this.player1.player.gold = 10;

            this.player1.clickCard(this.aVeryLargeShadow11);
            this.player1.clickCard(this.aVeryLargeShadow12);
        });

        it('should reveal first card marshalled into shadows', function () {
            expect(this.aVeryLargeShadow11.location === 'shadows' && this.game.cardVisibility.isVisible(this.aVeryLargeShadow11, this.player2)).toBe(true);
        });

        it('should reveal cards marshalled into shadows after the first', function () {
            expect(this.aVeryLargeShadow12.location === 'shadows' && this.game.cardVisibility.isVisible(this.aVeryLargeShadow12, this.player2)).toBe(true);
        });

        describe('when card leaves shadows area', function () {
            beforeEach(function () {
                this.player1.clickCard(this.aVeryLargeShadow11);
            });

            it('should hide card going from shadows into hand', function () {
                expect(this.aVeryLargeShadow11.location === 'hand' && this.game.cardVisibility.isVisible(this.aVeryLargeShadow11, this.player2)).toBe(false);
            });

            describe('when card from hand goes back to shadow', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.aVeryLargeShadow11);
                });

                it('card should be revealed again', function () {
                    expect(this.aVeryLargeShadow11.location === 'shadows' && this.game.cardVisibility.isVisible(this.aVeryLargeShadow11, this.player2)).toBe(true);
                });

                describe('when another card is marshalled into shadows', function () {
                    beforeEach(function () {
                        this.player2.dragCard(this.sweetRobin, 'play area');
                        this.player1.clickCard(this.aVeryLargeShadow13);
                    });

                    it('card should be revealed', function () {
                        expect(this.aVeryLargeShadow13.location === 'shadows' && this.game.cardVisibility.isVisible(this.aVeryLargeShadow13, this.player2)).toBe(true);
                    });

                    it('should correctly satisfy reaction condition of sweetrobin', function () {
                        expect(this.player2.currentPrompt().menuTitle).toBe('Any interrupts?');
                    });

                    describe('when sweetrobin interrupt is triggered', function () {
                        beforeEach(function () {
                            this.player2.clickCard(this.sweetRobin);
                        })

                        it('card should be removed from play', function () {
                            expect(this.aVeryLargeShadow13.location).toBe('out of game');
                        });
                    });
                });
            });
        });
    });
});
