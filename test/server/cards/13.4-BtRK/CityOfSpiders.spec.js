describe('City of Spiders', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'City Festival (JS)', plotDeck: ['City of Spiders'] }
        });
        this.completeChallengesPhase();
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('initiates the when revealed ability of a City plot in your used pile', function () {
        this.player1.clickCard(this.cityFestival);

        expect(this.player1Object.gold).toBe(3 + this.cityOfSpiders.getIncome());
        expect(this.player1).isReadyToTakeAction();
    });
});
