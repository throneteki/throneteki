describe('Ser Kevan Lannister', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'lannister',
                hand: ['Ser Kevan Lannister'],
                discard: ['Sweet Cersei'],
                gold: 6
            }
        });
        this.player1.clickCard(this.serKevanLannister);
        this.player1.triggerAbility(this.serKevanLannister);
        this.player1.clickCard(this.sweetCersei);
    });

    it('puts a lannister or neutral location or attachment into play from your discard pile after you marshal him', function () {
        expect(this.sweetCersei.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
