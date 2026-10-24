describe('Wick Whittlestick', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], shadows: ['Wick Whittlestick'], gold: 3 },
            player2: { inPlay: ['Castle Guard', 'Winterfell Steward'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.wickWhittlestick);
        this.player1.triggerAbility('Wick Whittlestick');
    });

    it('has each player discard a participating character they control', function () {
        expect(this.player2).not.toAllowSelect(this.winterfellSteward);
        this.player1.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.castleGuard);
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('play area');
    });
});
