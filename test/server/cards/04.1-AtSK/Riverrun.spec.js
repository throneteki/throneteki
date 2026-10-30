describe('Riverrun', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Riverrun', 'Tumblestone Knight'],
                hand: ['Riverrun Minstrel'],
                gold: 4
            }
        });
        this.player1.clickCard(this.riverrunMinstrel);
        this.player1.triggerAbility(this.riverrunMinstrel);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.riverrun);
    });

    it('kneels to give a House Tully character 1 power after it gains power', function () {
        expect(this.riverrun.kneeled).toBe(true);
        expect(this.tumblestoneKnight.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
