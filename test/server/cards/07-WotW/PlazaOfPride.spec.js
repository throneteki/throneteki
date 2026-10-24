describe('Plaza of Pride', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                inPlay: ['Plaza of Pride', { card: 'Margaery Tyrell (Core)', kneeling: true }],
                hand: ['Burned Men']
            }
        });
        this.player1.clickCard(this.plazaOfPride);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickCard(this.margaeryTyrell);
    });

    it('kneels and discards a card to stand a character with printed cost up to 3 higher than the discarded card', function () {
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.margaeryTyrell.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
