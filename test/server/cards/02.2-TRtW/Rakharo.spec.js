describe('Rakharo (TRtW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Rakharo (TRtW)', 'Aggo'] },
            player2: { inPlay: ['Hot Pie (FFH)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.rakharo);
        this.player2.clickCard(this.hotPie);
        this.player1.triggerAbility(this.rakharo);
    });

    it('gains intimidate while you control another Bloodrider, and gains 1 power after a character is killed for claim in a challenge you initiated', function () {
        expect(this.rakharo.hasKeyword('intimidate')).toBe(true);
        expect(this.rakharo.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
