describe("Robert's Rebellion (TIC)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: "Robert's Rebellion (TIC)",
                power: 3,
                inPlay: ['Joffrey Baratheon (Core)']
            },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.joffreyBaratheon);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.completeChallengesPhase();
    });

    it('discards 3 power from your faction card when the challenges phase ends if you lost a power challenge', function () {
        expect(this.player1Object.faction.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
