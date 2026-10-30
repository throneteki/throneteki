describe('Ravages of War', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Ravages of War'],
                inPlay: ['Hedge Knight'],
                hand: ['Castle Guard'],
                shadows: ['Nighttime Marauders (R)']
            },
            player2: { inPlay: ['Winterfell Steward'], hand: ['The Roseroad'] }
        });
        this.player1.selectPlot('Ravages of War');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.winterfellSteward);
        this.player1.clickCard(this.castleGuard);
        this.player2.clickCard(this.theRoseroad);
        this.player1.clickCard(this.nighttimeMarauders);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
    });

    it('has each player sacrifice a character or location and discard a card from hand and from shadows', function () {
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.nighttimeMarauders.location).toBe('discard pile');
    });
});
