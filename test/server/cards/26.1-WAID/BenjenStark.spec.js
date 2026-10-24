describe('Benjen Stark (WAID)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Benjen Stark (WAID)'] },
            player2: { inPlay: ['Tumblestone Knight', 'Hot Pie (FFH)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.benjenStark);
        this.player1.triggerAbility(this.benjenStark);
        this.player1.clickPrompt('Power');
        this.player2.clickCard(this.hotPie);
        this.player1.clickPrompt('Done');
    });

    it('stops the losing opponent initiating challenges of the named type against you this phase after you win a military challenge he attacks in', function () {
        expect(this.player2).toHaveDisabledPromptButton('Power');
        expect(this.player2).not.toHaveDisabledPromptButton('Military');
        expect(this.player2).isReadyToTakeAction();
    });
});
