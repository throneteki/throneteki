describe('The Red Viper (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Red Viper (SoD)', 'Obara Sand (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.obaraSand);
        this.player1.triggerAbility(this.theRedViper);
    });

    it('gains 1 power after you win a challenge with an attacking Bastard, and gets +1 STR for each power he has', function () {
        expect(this.theRedViper.power).toBe(1);
        expect(this.theRedViper.getStrength()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
