describe('The Red Viper (OR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['The Red Viper (OR)']
            },
            player2: {
                inPlay: ['Defender of the Wall']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.theRedViper);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.defenderOfTheWall);
        this.player2.clickPrompt('Done');
    });

    it('stops each defending character with fewer than 2 challenge icons contributing while he attacks', function () {
        expect(this.game.currentChallenge.defenderStrength).toBe(0);

        this.skipActionWindow();
        this.player2.clickCard(this.defenderOfTheWall);

        expect(this.player1).isReadyToTakeAction();
    });
});
