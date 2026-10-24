describe('The Stranger', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['The Stranger (HMW)'],
                inPlay: ['Tumblestone Knight', 'Robb Stark (Core)']
            },
            player2: { inPlay: ['Hedge Knight', 'Winterfell Steward'] }
        });
        this.player1.selectPlot('The Stranger');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.robbStark);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Done');
    });

    it('kills each character with the same printed cost as a chosen character', function () {
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.robbStark.location).toBe('dead pile');
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
