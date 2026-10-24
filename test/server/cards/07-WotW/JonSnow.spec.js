describe('Jon Snow (WotW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Jon Snow (WotW)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.jonSnow);
        this.player1.triggerAbility('Jon Snow');
    });

    it('stands each attacking Wildling character after you win a challenge as the attacker', function () {
        expect(this.jonSnow.kneeled).toBe(false);
    });
});
