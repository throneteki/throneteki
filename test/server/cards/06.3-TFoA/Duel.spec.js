describe('Duel', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Duel'] },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)', 'Balon Greyjoy (Core)', 'Hedge Knight']
            }
        });
        this.player1.selectPlot(this.duel);
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('has an opponent choose 2 non-Army characters with printed cost 6 or higher, kneel 1 and kill the other', function () {
        expect(this.player2).toBeAbleToSelect(this.serJaimeLannister);
        expect(this.player2).toBeAbleToSelect(this.balonGreyjoy);
        expect(this.player2).not.toBeAbleToSelect(this.hedgeKnight);
        this.player2.clickCard(this.serJaimeLannister);
        expect(this.player2).not.toBeAbleToSelect(this.serJaimeLannister);
        this.player2.clickCard(this.balonGreyjoy);
        expect(this.serJaimeLannister.kneeled).toBe(true);
        expect(this.balonGreyjoy.location).toBe('dead pile');
        expect(this.hedgeKnight.location).toBe('play area');
    });
});
