describe('Rebuilding', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Rebuilding'],
                discard: ['Hedge Knight', 'Castle Guard', 'Tumblestone Knight', 'Ranging Party']
            }
        });
        this.player1.selectPlot('Rebuilding');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('shuffles up to 3 cards from your discard pile into your deck', function () {
        expect(this.hedgeKnight.location).not.toBe('discard pile');
        expect(this.castleGuard.location).not.toBe('discard pile');
        expect(this.tumblestoneKnight.location).not.toBe('discard pile');
        expect(this.rangingParty.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
