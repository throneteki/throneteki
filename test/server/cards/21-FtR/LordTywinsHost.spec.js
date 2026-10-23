describe("Lord Tywin's Host", function () {
    function setup(hand) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Lord Tywin's Host"] },
            player2: { drawDeck: ['Castle Guard'], hand }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.lordTywinsHost);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility("Lord Tywin's Host");
    }

    it('gives Tywin Lannister a military icon', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ["Lord Tywin's Host", 'Tywin Lannister (Core)'] }
        });
        expect(this.tywinLannister.hasIcon('military')).toBe(true);
    });

    it('has the losing opponent discard a card of the type discarded by pillage', function () {
        setup.call(this, ['Hedge Knight', 'The Roseroad']);
        this.player2.clickCard(this.hedgeKnight);
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('hand');
    });

    it('has them reveal their hand instead if it has no card of that type', function () {
        setup.call(this, ['The Roseroad']);
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
