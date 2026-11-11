describe('Shadow of the North', function () {
    function setup(plot) {
        this.setupTest({
            phase: 'challenge',
            player1: { plot, inPlay: ['Hedge Knight'], shadows: ['Shadow of the North'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.shadowOfTheNorth);
    }

    it('raises the claim value on your revealed plot card by 1 until the end of the challenge', function () {
        setup.call(this, 'Filler Plot');
        expect(this.player1Object.getClaim()).toBe(2);
        expect(this.player2Object.getClaim()).toBe(1);
        expect(this.shadowOfTheNorth.location).toBe('discard pile');
    });

    it('returns to your hand if there is a Winter plot card revealed', function () {
        setup.call(this, 'The Winds of Winter');
        expect(this.shadowOfTheNorth.location).toBe('hand');
    });

    it('can only be played during a challenge', function () {
        this.setupTest({ phase: 'challenge', player1: { shadows: ['Shadow of the North'] } });
        expect(this.player1.actionUnavailableReason(this.shadowOfTheNorth)).toBe('condition');
    });
});
