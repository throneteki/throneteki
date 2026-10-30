describe('Maester Aemon (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Maester Aemon (Core)', 'Steward at the Wall']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.stewardAtTheWall);
        this.player1.triggerAbility(this.maesterAemon);
    });

    it('kneels to save a thenightswatch character that would be killed', function () {
        expect(this.maesterAemon.kneeled).toBe(true);
        expect(this.stewardAtTheWall.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
