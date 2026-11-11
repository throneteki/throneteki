describe('Shireen Baratheon (MoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Shireen Baratheon (MoD)', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.shireenBaratheon);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.shireenBaratheon);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('stops herself and another participating character contributing STR during a challenge she is participating in', function () {
        expect(this.game.currentChallenge.attackerStrength).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
