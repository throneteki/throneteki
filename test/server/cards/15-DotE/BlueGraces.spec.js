describe('Blue Graces', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Blue Graces'],
                discard: ['Robb Stark (Core)'],
                deadPile: ['Hedge Knight']
            }
        });
        this.player1.clickCard(this.blueGraces);
    });

    it('removes itself from the game to shuffle a card with printed cost 6 or higher into your deck', function () {
        expect(this.player1).not.toAllowSelect(this.hedgeKnight);
        this.player1.clickCard(this.robbStark);

        expect(this.blueGraces.location).toBe('out of game');
        expect(this.robbStark.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
