describe('Sweetsleep', function() {
    integration(function() {
        describe('when Sweetsleep is on a character', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Winterfell Steward', 'Knighted', 'Sweetsleep'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Winterfell Steward', 'hand');

                this.player1.clickCard(this.character);
                this.completeSetup();
                this.knighted = this.player1.findCardByName('Knighted', 'hand');

                this.selectFirstPlayer(this.player1);
            });

            it('other attachments placed before Sweetsleep should be blank', function() {
                this.player1.clickCard(this.knighted);
                this.player1.clickCard(this.character);
                expect(this.character.getStrength()).toBe(2);
                expect(this.character.hasTrait('Knight')).toBe(true);
                this.player1.clickCard('Sweetsleep', 'hand');
                this.player1.clickCard(this.character);
                expect(this.knighted.isAnyBlank()).toBe(true);
                expect(this.character.getStrength()).toBe(1);
                expect(this.character.hasTrait('Knight')).toBe(false);
            });

            it('other attachments placed after Sweetsleep should be blank', function() {
                this.player1.clickCard('Sweetsleep', 'hand');
                this.player1.clickCard(this.character);
                this.player1.clickCard(this.knighted);
                this.player1.clickCard(this.character);
                expect(this.knighted.isAnyBlank()).toBe(true);
                expect(this.character.getStrength()).toBe(1);
                expect(this.character.hasTrait('Knight')).toBe(false);
                this.completeMarshalPhase();
            });
        });
    });
});
