describe('A Wall of Roses', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { shadows: ['A Wall of Roses'], hand: ['Tumblestone Knight'], gold: 1 },
            player2: { inPlay: ['Cersei Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.cerseiLannister);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.aWallOfRoses);
    });

    it('reveals your hand after a challenge is initiated against you, then stands up to 2 attackers and removes them from the challenge', function () {
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickPrompt('Done');

        expect(this.cerseiLannister.kneeled).toBe(false);
        expect(this.cerseiLannister.isAttacking()).toBe(false);

        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player2).isReadyToTakeAction();
    });
});
