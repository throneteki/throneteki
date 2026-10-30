describe('Godsgrace', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'Summer Harvest', inPlay: ['Godsgrace', 'Ser Arys Oakheart (FUtG)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serArysOakheart);
        this.player1.triggerAbility(this.godsgrace);
    });

    it('kneels to have a martell character you control gain 1 more power after it gains power while a Summer plot is revealed', function () {
        expect(this.serArysOakheart.power).toBe(2);
        expect(this.godsgrace.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
