describe('Riverrun Minstrel', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Riverrun Minstrel'], inPlay: ['Tumblestone Knight'], gold: 4 }
        });
        this.player1.clickCard(this.riverrunMinstrel);
        this.player1.triggerAbility(this.riverrunMinstrel);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gives a House Tully character 1 power after it enters play', function () {
        expect(this.tumblestoneKnight.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
