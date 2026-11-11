describe('Ser Clayton Suggs (WAID)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Clayton Suggs (WAID)', 'Robb Stark (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.robbStark);
        this.player1.triggerAbility('Ser Clayton Suggs');
    });

    it('gives a character +1 STR until the end of the phase after it gains power', function () {
        this.player1.clickPrompt('Give +1 STR');
        expect(this.robbStark.getStrength()).toBe(this.robbStark.getPrintedStrength() + 1);
    });

    it('or -1 STR', function () {
        this.player1.clickPrompt('Give -1 STR');
        expect(this.robbStark.getStrength()).toBe(this.robbStark.getPrintedStrength() - 1);
    });
});
