describe('Northern Pyre', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'The Winds of Winter',
                inPlay: ['Northern Pyre', 'Tumblestone Knight']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.northernPyre);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to set the STR of a participating character to 3 while there is a Winter plot revealed', function () {
        expect(this.northernPyre.kneeled).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(3);
        expect(this.player2).isReadyToTakeAction();
    });
});
