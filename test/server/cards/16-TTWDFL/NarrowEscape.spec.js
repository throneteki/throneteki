describe('Narrow Escape', function () {
    function setup(hand) {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Hedge Knight'], hand: ['Narrow Escape'] },
            player2: { inPlay: ['Castle Guard'], hand }
        });
        this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
        this.player1.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.narrowEscape);
    }

    it('puts each character killed this phase back into play', function () {
        setup.call(this, []);
        expect(this.hedgeKnight.location).toBe('play area');
    });

    it('lets an opponent discard their hand to cancel it', function () {
        setup.call(this, ['The Roseroad']);
        this.player2.clickPrompt('Yes');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('dead pile');
    });
});
