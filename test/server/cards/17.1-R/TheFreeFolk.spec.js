describe('The Free Folk (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'The Free Folk (R)', inPlay: ['Wildling Bandit'] },
            player2: { hand: ['Hot Pie (FFH)', 'Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.wildlingBandit);
        this.player1.triggerAbility(this.theFreeFolk);
    });

    it('kneels your faction card to raise your claim by 1 after you win a challenge with an attacking Wildling', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        this.player2.clickPrompt('Done');

        expect(this.player2Object.hand).toHaveLength(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
