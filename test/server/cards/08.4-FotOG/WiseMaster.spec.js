describe('Wise Master', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                inPlay: [{ card: 'Wise Master', gold: 1 }],
                discard: ['Confinement']
            }
        });
        this.player1.clickCard(this.wiseMaster);
        this.player1.clickCard(this.confinement);
    });

    it('discards 1 gold to return an out-of-faction attachment or event from your discard pile to your hand', function () {
        expect(this.wiseMaster.gold).toBe(0);
        expect(this.confinement.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
