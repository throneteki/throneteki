describe('The Doom of Valyria', function () {
    function setup(hand) {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['The Doom of Valyria'],
                usedPlots: ['A Noble Cause', 'Sneak Attack', 'Trading with the Pentoshi'],
                inPlay: ['Hedge Knight']
            },
            player2: { inPlay: ['Winterfell Steward'], hand }
        });
        this.player1.selectPlot('The Doom of Valyria');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    }

    it('discards each non-limited card from play with 3 or more plots in your used pile', function () {
        setup.call(this, ['The Roseroad', 'The Kingsroad', 'Castle Guard']);
        this.player2.clickPrompt('No');
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('discard pile');
    });

    it('lets an opponent discard a hand of at least 3 cards to cancel it', function () {
        setup.call(this, ['The Roseroad', 'The Kingsroad', 'Castle Guard']);
        this.player2.clickPrompt('Yes');
        this.player2.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.theRoseroad.location).toBe('discard pile');
    });

    it('cannot be cancelled with fewer than 3 cards in hand', function () {
        setup.call(this, ['The Roseroad']);
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('hand');
    });
});
