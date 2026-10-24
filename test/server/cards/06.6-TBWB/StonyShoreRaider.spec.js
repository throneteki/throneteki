describe('Stony Shore Raider', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'greyjoy', inPlay: [{ card: 'Stony Shore Raider', gold: 1 }] },
            player2: { inPlay: ['Sweet Cersei'] }
        });
        this.player1.clickCard(this.stonyShoreRaider);
        this.player1.clickCard(this.sweetCersei);
    });

    it('discards 1 gold to kneel a location with printed cost 3 or lower', function () {
        expect(this.stonyShoreRaider.gold).toBe(0);
        expect(this.sweetCersei.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
