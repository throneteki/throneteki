describe('At the Gates', function () {
    describe('when revealed with no City plot in your used pile', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['At the Gates'],
                    drawDeck: ['Old Gate', 'Kingswood (CoW)', 'Golden Tooth', 'Hedge Knight']
                }
            });

            this.player1.selectPlot(this.atTheGates);
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('puts a limited location with printed cost 1 or lower into play', function () {
            expect(this.player1).toBeAbleToSelect(this.oldGate);
            expect(this.player1).not.toBeAbleToSelect(this.kingswood);
            expect(this.player1).not.toBeAbleToSelect(this.goldenTooth);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);

            this.player1.clickCard(this.oldGate);

            expect(this.oldGate.location).toBe('play area');
            expect(this.kingswood.location).not.toBe('play area');
            expect(this.goldenTooth.location).not.toBe('play area');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses At the Gates to search their deck for a limited location with printed cost 1 or lower'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when revealed with a City plot in your used pile', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    plot: 'City of Wealth',
                    plotDeck: ['At the Gates'],
                    drawDeck: ['Old Gate']
                }
            });

            this.completeChallengesPhase();
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.oldGate);
        });

        it('adds the location to your hand instead', function () {
            expect(this.oldGate.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
