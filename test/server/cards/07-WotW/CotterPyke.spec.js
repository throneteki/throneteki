describe('Cotter Pyke', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                plot: 'The Winds of Winter',
                inPlay: ['Cotter Pyke', 'Steward at the Wall']
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.cotterPyke);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.cotterPyke);
    });

    it('gives a thenightswatch character stealth after he bypasses a character with stealth while there is a Winter plot revealed', function () {
        this.player1.clickCard(this.stewardAtTheWall);

        expect(this.stewardAtTheWall.hasKeyword('stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
