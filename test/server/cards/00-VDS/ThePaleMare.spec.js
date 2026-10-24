describe('The Pale Mare', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['The Pale Mare (VDS)'],
                inPlay: ['Robb Stark (Core)', 'Hedge Knight', 'Castle Guard']
            },
            player2: { inPlay: ['Winterfell Steward'] }
        });
        this.player1.selectPlot('The Pale Mare');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.winterfellSteward);
        this.player2.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it('kills each character a player did not choose within 10 printed cost', function () {
        expect(this.robbStark.location).toBe('play area');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.castleGuard.location).toBe('dead pile');
        expect(this.winterfellSteward.location).toBe('play area');
    });
});
