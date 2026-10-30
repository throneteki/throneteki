describe('Secrets of the Conclave', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Secrets of the Conclave',
                drawDeck: [
                    'Hedge Knight',
                    'Castle Guard',
                    'The Roseroad',
                    'The Kingsroad',
                    'Winterfell Steward'
                ]
            }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility('Secrets of the Conclave');
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
    });

    it('looks at the top 5 cards after the challenges phase begins, adding 1 to hand, discarding 1 and returning the rest', function () {
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.player1Object.drawDeck.slice(0, 3)).toEqual(
            expect.arrayContaining([this.theRoseroad, this.theKingsroad, this.winterfellSteward])
        );
    });
});
