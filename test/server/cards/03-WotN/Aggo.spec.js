describe('Aggo', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                plot: 'Late Summer Feast',
                inPlay: [{ card: 'Aggo', kneeling: true }]
            }
        });
        this.player1.clickCard(this.aggo);
        this.player1.clickCard(this.aggo);
    });

    it('stands a Bloodrider character while there is a Summer plot revealed', function () {
        expect(this.aggo.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
