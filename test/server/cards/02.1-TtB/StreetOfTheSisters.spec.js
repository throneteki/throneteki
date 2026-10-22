describe('Street of the Sisters', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Street of the Sisters', 'Khal Drogo (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);
        this.player1.triggerAbility(this.streetOfTheSisters);
    });

    it('kneels your faction card to gain 1 power for your faction after you win a power challenge by 5 or more STR', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
