describe('The Knight', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Knight (TIC)'] },
            player2: { discard: ['Hedge Knight', 'Castle Guard'] }
        });
        this.startingClaim = this.player1Object.getClaim();
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.theKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickMenu(this.theKnight, 'Raise claim');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
    });

    it("returns 2 characters from the defending player's discard pile to hand, then raises your claim by 1", function () {
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('hand');
        expect(this.player1Object.getClaim()).toBe(this.startingClaim + 1);
    });
});
