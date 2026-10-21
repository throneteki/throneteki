describe('Daenerys Targaryen (FUtG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Daenerys Targaryen (FUtG)', 'Khal Drogo (Core)', 'Rakharo (DotE)']
            }
        });
    });

    it('gives Khal Drogo intimidate, and gains 1 power for your faction for each unique attacking Bloodrider after you win as the attacker', function () {
        expect(this.khalDrogo.hasKeyword('intimidate')).toBe(true);

        this.unopposedChallenge(this.player1, 'Power', this.rakharo);
        this.player1.triggerAbility(this.daenerysTargaryen);

        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
