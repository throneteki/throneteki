describe('The Dornish Wars', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'The Dornish Wars (WK)', inPlay: ['Robb Stark (Core)'] },
            player2: { inPlay: ['Black Walder'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.robbStark);
        this.player1.triggerAbility('The Dornish Wars');
        this.player1.clickCard(this.blackWalder);
        this.player1.clickPrompt('Intrigue');
    });

    it('has a losing character lose a challenge icon of your choice until the end of the phase', function () {
        expect(this.blackWalder.hasIcon('intrigue')).toBe(false);
        expect(this.blackWalder.hasIcon('military')).toBe(true);
    });
});
