describe('Wraith', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'baratheon', inPlay: ['Wraith', 'Dale Seaworth'] },
            player2: { inPlay: ['Sweet Cersei'] }
        });
    });

    it('gives Dale Seaworth stealth while you control him, and kneels and sacrifices itself to kneel a location', function () {
        expect(this.daleSeaworth.hasKeyword('stealth')).toBe(true);

        this.player1.clickCard(this.wraith);
        this.player1.clickCard(this.sweetCersei);

        expect(this.wraith.location).toBe('discard pile');
        expect(this.sweetCersei.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
