describe('Arianne Martell (Core)', function() {
    integration(function() {
        describe('vs Ramsay Snow', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'A Noble Cause',
                    'Arianne Martell (Core)', 'Ramsay Snow', 'Hedge Knight'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.arianne = this.player1.findCardByName('Arianne Martell', 'hand');
                this.otherCharacter = this.player1.findCardByName('Hedge Knight', 'hand');
                this.player1.clickCard(this.arianne);
                this.player1.clickCard(this.otherCharacter);

                this.completeSetup();
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            describe('when Ramsay Snow is put into play using Arianne\'s ability', function() {
                beforeEach(function() {
                    this.player1.clickMenu('Arianne Martell', 'Put character into play');
                    this.player1.clickCard('Ramsay Snow', 'hand');
                });

                it('does not allow Arianne to be sacrificed', function() {
                    expect(this.player1).toAllowSelect(this.otherCharacter);
                    expect(this.player1).not.toAllowSelect(this.arianne);
                    expect(this.arianne.location).toEqual('hand');
                });
            });
        });
    });
});
