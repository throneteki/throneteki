describe('Bend the Knee', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Robert Baratheon (Core)'], hand: ['Bend the Knee'], gold: 1 },
            player2: { inPlay: ['Eddard Stark (Core)'] }
        });
        this.player1.clickCard(this.bendTheKnee);
        this.player1.clickCard(this.eddardStark);
    });

    it('kneels a Lord or Lady character while you control a standing King', function () {
        expect(this.eddardStark.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
