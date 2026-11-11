describe('Return to the Fields', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Return to the Fields (R)'],
                inPlay: ['Hedge Knight', 'Steward at the Wall', 'Castle Guard'],
                drawDeck: [
                    'Winterfell Steward',
                    'Lannisport Merchant',
                    'Garden Caretaker',
                    'Desert Scavenger',
                    'Targaryen Loyalist',
                    'Iron Islands Fishmonger'
                ]
            }
        });
        this.player1.selectPlot('Return to the Fields');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.stewardAtTheWall);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it('sacrifices up to 3 characters and draws 1 card for each', function () {
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.stewardAtTheWall.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('play area');
        expect(this.player1Object.hand.length).toBe(2 + 2);
    });
});
