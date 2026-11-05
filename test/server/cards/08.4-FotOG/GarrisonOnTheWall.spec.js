describe('Garrison on the Wall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Garrison on the Wall', 'Tumblestone Knight']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.garrisonOnTheWall);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.garrisonOnTheWall);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels a non-thenightswatch character to stand itself after it is declared as a defender', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.garrisonOnTheWall.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
