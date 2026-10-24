describe('Pulling the Strings', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plotDeck: ['Pulling the Strings'] },
            player2: { plot: 'Counting Coppers' }
        });
        this.completeChallengesPhase();
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it("initiates the when revealed ability of an Edict, Kingdom or Scheme plot in an opponent's used pile", function () {
        this.player1.clickCard(this.countingCoppers);

        expect(this.player1Object.hand).toHaveLength(5);
        expect(this.player2Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
