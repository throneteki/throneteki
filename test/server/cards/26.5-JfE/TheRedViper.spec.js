describe('The Red Viper (JfE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Red Viper (JfE)'], shadows: ['Undercity Spymaster'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.theRedViper);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theRedViper);
        this.player1.clickCard(this.undercitySpymaster);
    });

    it('discards a card from shadows to raise your claim by 1 during a challenge in which he is attacking', function () {
        expect(this.undercitySpymaster.location).toBe('discard pile');
        expect(this.player1Object.getClaim()).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
