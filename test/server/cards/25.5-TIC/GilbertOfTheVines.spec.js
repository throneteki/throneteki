describe('Gilbert of the Vines (TIC)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Gilbert of the Vines (TIC)'],
                drawDeck: ['Hedge Knight', 'Castle Guard', 'The Roseroad'],
                gold: 5
            }
        });
        this.player1.clickCard(this.gilbertOfTheVines);
        this.player1.selectValue(3);
    });

    it('reveals the top X cards of your deck and adds up to 2 of them to your hand', function () {
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.castleGuard.location).toBe('draw deck');
    });

    it('can add none of them', function () {
        this.player1.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
