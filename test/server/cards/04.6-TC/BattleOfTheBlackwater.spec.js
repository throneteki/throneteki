describe('Battle of the Blackwater', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Battle of the Blackwater'],
                inPlay: [{ card: 'Eddard Stark (Core)', dupes: 1 }]
            },
            player2: { inPlay: [{ card: 'Robb Stark (Core)', dupes: 1 }] }
        });
        [this.knightDupe] = this.eddardStark.dupes;
        [this.guardDupe] = this.robbStark.dupes;
        this.player1.selectPlot('Battle of the Blackwater');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('discards each duplicate you and the chosen opponent control', function () {
        expect(this.eddardStark.dupes.length).toBe(0);
        expect(this.robbStark.dupes.length).toBe(0);
        expect(this.knightDupe.location).toBe('discard pile');
        expect(this.guardDupe.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
