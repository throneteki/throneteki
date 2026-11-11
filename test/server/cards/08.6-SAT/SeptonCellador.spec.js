describe('Septon Cellador', function () {
    it('kneels to have an opponent discard a character from their hand', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Septon Cellador'] },
            player2: { hand: ['Hedge Knight', 'The Roseroad'] }
        });
        this.player1.clickMenu(this.septonCellador, 'Opponent discards character');
        expect(this.player2).not.toAllowSelect(this.theRoseroad);
        this.player2.clickCard(this.hedgeKnight);
        expect(this.septonCellador.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('discard pile');
    });

    it('has them reveal their hand instead if it has no characters', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Septon Cellador'] },
            player2: { hand: ['The Roseroad'] }
        });
        this.player1.clickMenu(this.septonCellador, 'Opponent discards character');
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
