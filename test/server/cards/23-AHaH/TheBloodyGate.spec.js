describe('The Bloody Gate (AHaH)', function () {
    function setup(kneeling, hand) {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: [{ card: 'The Bloody Gate (AHaH)', kneeling }, 'Hedge Knight'] },
            player2: { inPlay: ['Ranging Party'], hand }
        });
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.rangingParty);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('The Bloody Gate');
    }

    it('has the winner choose and discard a card from their hand after you lose a military challenge defending', function () {
        setup.call(this, false, ['Castle Guard', 'The Roseroad']);
        this.player2.clickCard(this.castleGuard);
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('hand');
    });

    it('discards a card at random instead while it is kneeling', function () {
        setup.call(this, true, ['Castle Guard']);
        expect(this.castleGuard.location).toBe('discard pile');
    });
});
