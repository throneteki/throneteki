describe('Womb of the World', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('targaryen', [
                'Trading with the Pentoshi',
                'Womb of the World (R)', 'Qotho (HoT)', 'Qotho (HoT)', 'Rakharo (DotE)', 'Rakharo (DotE)',
                { name: 'Hedge Knight', count: 50 }
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            [this.character, this.dupe] = this.player1.filterCardsByName('Qotho');
            [this.characterR, this.dupeR] = this.player1.filterCardsByName('Rakharo');
            this.womb = this.player1.findCardByName('Womb of the World');

            this.player1.dragCard(this.character, 'hand');
            this.player1.dragCard(this.characterR, 'hand');
            this.player1.dragCard(this.dupe, 'hand');
            this.player1.dragCard(this.dupeR, 'hand');
            this.player1.dragCard(this.womb, 'hand');
            this.player1.clickCard(this.womb);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            // Drag Rakharo into the dead pile, a later test will use him again
            this.player1.dragCard(this.characterR, 'dead pile');
            this.player1.dragCard(this.dupeR, 'dead pile');
        });

        describe('when putting out a character', function() {
            beforeEach(function() {
                // Drag character back to deck
                this.player1.dragCard(this.character, 'draw deck');
                this.completeMarshalPhase();
                this.player1.clickMenu(this.womb, 'Reveal top 5 cards');
                this.player1.clickCard(this.character);
            });

            it('should put the character into play', function() {
                expect(this.character.location).toBe('play area');
            });

            describe('and the character is in play when the phase ends', function() {
                beforeEach(function() {
                    this.completeChallengesPhase();
                });

                it('should return the character to the bottom of the deck', function() {
                    expect(this.character.location).toBe('hand');
                });
            });

            describe('and the character leaves play before the phase ends', function() {
                beforeEach(function() {
                    this.game.killCharacter(this.character);
                    this.completeChallengesPhase();
                });

                it('should not return the character to the bottom of the deck', function() {
                    expect(this.character.location).not.toBe('hand');
                });
            });
        });

        describe('when putting out a duplicate', function() {
            beforeEach(function() {
                this.player1.dragCard(this.dupe, 'draw deck');

                this.player1.clickCard(this.character);

                this.completeMarshalPhase();
                this.player1.clickMenu(this.womb, 'Reveal top 5 cards');

                this.player1.clickCard(this.dupe);
            });

            it('should duplicate the character', function() {
                expect(this.character.dupes).toContain(this.dupe);
                expect(this.dupe.location).toBe('duplicate');
            });

            describe('and the dupe is in play when the phase ends', function() {
                beforeEach(function() {
                    this.completeChallengesPhase();
                });

                it('should remove the dupe from the character', function() {
                    expect(this.character.dupes).not.toContain(this.dupe);
                });

                it('should return the dupe to hand', function() {
                    expect(this.dupe.location).toBe('hand');
                });
            });

            describe('and the dupe leaves play before the phase ends', function() {
                beforeEach(function() {
                    this.game.killCharacter(this.character);
                    this.completeChallengesPhase();
                });

                it('should not return the dupe to hand', function() {
                    expect(this.dupe.location).not.toBe('hand');
                });
            });
        });

        describe('when putting out a character', function() {
            beforeEach(function() {
                // Drag character back to deck
                this.player1.dragCard(this.character, 'draw deck');
                this.player1.dragCard(this.characterR, 'draw deck');
                this.player1.dragCard(this.dupeR, 'draw deck');
                this.completeMarshalPhase();
            });

            it('should put the character with the lowest printed cost into play', function() {
                this.player1.clickMenu(this.womb, 'Reveal top 5 cards');
                this.player1.clickCard(this.character);
                expect(this.character.location).toBe('draw deck');
                this.player1.clickCard(this.characterR);
                expect(this.characterR.location).toBe('play area');
            });

            it('should put the character with the lowest printed cost into play when the other character with lower printed cost is not eligible', function() {
                this.player1.dragCard(this.characterR, 'dead pile');
                this.player1.clickMenu(this.womb, 'Reveal top 5 cards');
                this.player1.clickCard(this.character);
                expect(this.character.location).toBe('play area');
            });
        });
    });
});
