describe('Fishwhiskers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Snowed Under',
                inPlay: ['Fishwhiskers']
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.fishwhiskers);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
    });

    it('stops each defending character contributing its STR while he attacks and there are more Winter than Summer plots', function () {
        expect(this.game.currentChallenge.defenderStrength).toBe(0);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
