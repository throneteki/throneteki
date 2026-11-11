describe('Compelled by the Faith', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Compelled by the Faith'],
                inPlay: [{ card: 'Tumblestone Knight', power: 2 }]
            },
            player2: { inPlay: [{ card: 'Khal Drogo (Core)', power: 1 }] }
        });
        this.player1.selectPlot('Compelled by the Faith');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it("moves all power on each card in play to its controller's faction card when revealed", function () {
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player2Object.faction.power).toBe(1);
        expect(this.khalDrogo.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
