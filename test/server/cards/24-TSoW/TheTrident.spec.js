describe('The Trident', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Trident', 'The Roseroad', 'Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
    });

    it('gives control of itself to the losing opponent after you win attacking', function () {
        this.player1.clickPrompt('Give Control');
        expect(this.theTrident).toBeControlledBy(this.player2);
    });

    it('unless you sacrifice another neutral location', function () {
        this.player1.clickPrompt('Sacrifice Location');
        this.player1.clickCard(this.theRoseroad);
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.theTrident).toBeControlledBy(this.player1);
    });

    it('raises your claim by 1', function () {
        this.player1.clickPrompt('Give Control');
        expect(this.player1Object.getClaim()).toBe(1);
        expect(this.player2Object.getClaim()).toBe(2);
    });
});
