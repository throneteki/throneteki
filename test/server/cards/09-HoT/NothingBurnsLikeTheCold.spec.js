describe('Nothing Burns Like The Cold', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Nothing Burns Like The Cold'],
                inPlay: [
                    { card: 'Hedge Knight', attachments: ['Noble Lineage'] },
                    'Casterly Rock (Core)'
                ]
            },
            player2: { inPlay: ['The Roseroad', 'Sunspear (Core)'] }
        });
        [this.lineage] = this.hedgeKnight.attachments;
        this.player1.selectPlot('Nothing Burns Like The Cold');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.lineage);
        this.player1.clickCard(this.casterlyRock);
        this.player2.clickCard(this.sunspear);
        this.player1.clickPrompt('Done');
    });

    it('has each player discard an attachment and a non-limited location they control', function () {
        expect(this.lineage.location).toBe('discard pile');
        expect(this.casterlyRock.location).toBe('discard pile');
        expect(this.sunspear.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('play area');
    });
});
