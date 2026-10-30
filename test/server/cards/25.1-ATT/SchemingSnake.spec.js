describe('Scheming Snake (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { shadows: ['Scheming Snake (ATT)'], inPlay: ['Burned Men'], gold: 2 }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.schemingSnake);
        this.player1.triggerAbility(this.schemingSnake);
        this.player1.clickCard(this.burnedMen);
    });

    it('stops a participating character with fewer than 2 icons contributing STR after it enters play during a challenge', function () {
        expect(this.game.currentChallenge.attackerStrength).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
