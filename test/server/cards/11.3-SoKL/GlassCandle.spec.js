describe('Glass Candle', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Maester Caleotte', attachments: ['Glass Candle'] }] },
            player2: { drawDeck: ['Hedge Knight'] }
        });
    });

    it('gives an attached Maester insight', function () {
        expect(this.maesterCaleotte.hasKeyword('insight')).toBe(true);
    });

    it("kneels to look at the top card of a player's deck and may discard it", function () {
        this.player1.clickMenu(this.glassCandle, 'Look at top card');
        this.player1.clickPrompt('player2');
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Yes');
        expect(this.glassCandle.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('discard pile');
    });
});
