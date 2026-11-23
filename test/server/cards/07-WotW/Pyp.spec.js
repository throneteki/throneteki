describe('Pyp', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'thenightswatch', inPlay: ['Pyp', 'Ghost (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', [this.pyp, this.ghost]);
        this.player1.triggerAbility(this.pyp);
    });

    it('gives another attacking thenightswatch character insight after he wins a challenge attacking', function () {
        this.player1.clickCard(this.ghost);

        expect(this.ghost.hasKeyword('insight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
