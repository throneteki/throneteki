describe('Ghost (WotW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: [{ card: 'Steward at the Wall', attachments: ['Ghost (WotW)'] }]
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.burnedMen);
        this.player1.clickCard(this.stewardAtTheWall);
        this.player1.triggerAbility(this.ghost);
    });

    it('returns itself to your hand to save the attached character', function () {
        expect(this.ghost.location).toBe('hand');
        expect(this.stewardAtTheWall.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
