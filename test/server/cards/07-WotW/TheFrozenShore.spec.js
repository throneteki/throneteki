describe('The Frozen Shore', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'Winter Festival', inPlay: ['The Frozen Shore', 'Osha'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.osha);
        this.player1.triggerAbility(this.theFrozenShore);
        this.player1.clickCard(this.osha);
        this.player1.clickPrompt('Done');
    });

    it('kneels to stand an attacking Wildling for each Winter plot revealed after you win a challenge', function () {
        expect(this.theFrozenShore.kneeled).toBe(true);
        expect(this.osha.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
