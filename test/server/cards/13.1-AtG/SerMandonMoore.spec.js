describe('Ser Mandon Moore (AtG)', function () {
    function setup(hand) {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Ser Mandon Moore (AtG)'], gold: 10 },
            player2: { inPlay: ['Hedge Knight'], hand }
        });
        this.player1.clickCard(this.serMandonMoore);
        this.player1.triggerAbility('Ser Mandon Moore');
    }

    it('has an opponent discard 2 cards after it comes out of shadows', function () {
        setup.call(this, ['Castle Guard', 'The Roseroad']);
        this.player2.clickPrompt('Discard 2 cards');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickCard(this.theRoseroad);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('play area');
    });

    it('lets them kill a character instead', function () {
        setup.call(this, ['Castle Guard', 'The Roseroad']);
        this.player2.clickPrompt('Kill character');
        this.player2.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.castleGuard.location).toBe('hand');
    });

    it('has them kill a character if they have fewer than 2 cards in hand', function () {
        setup.call(this, ['Castle Guard']);
        this.player2.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('dead pile');
    });
});
