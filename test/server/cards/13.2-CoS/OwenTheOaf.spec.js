describe('Owen the Oaf', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Owen the Oaf', 'Grand Maester Pycelle (Core)']
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.owenTheOaf);
        this.player1.clickCard(this.grandMaesterPycelle);
        this.player1.clickPrompt('Done');
    });

    it('stops each participating character with more than 1 challenge icon contributing while he participates', function () {
        expect(this.game.currentChallenge.attackerStrength).toBe(4);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
