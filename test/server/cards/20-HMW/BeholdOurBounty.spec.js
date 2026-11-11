describe('Behold our Bounty (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                hand: ['Behold our Bounty (HMW)'],
                inPlay: ['Littlefinger (Core)']
            },
            player2: { hand: ['Burned Men', 'Hot Pie (FFH)'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.littlefinger);
        this.player1.triggerAbility(this.beholdOurBounty);
        this.player1.clickCard(this.littlefinger);
    });

    it('returns an attacking Small Council or Spy character to your hand to raise your claim by 1 after you win a challenge', function () {
        expect(this.littlefinger.location).toBe('hand');

        this.player2.clickPrompt('Done');

        expect(this.player2Object.hand).toHaveLength(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
