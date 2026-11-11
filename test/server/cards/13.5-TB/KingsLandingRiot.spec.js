describe("King's Landing Riot", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: "King's Landing Riot",
                usedPlots: ['City of Wealth', 'City of Wealth', 'City Blockade (FUtG)'],
                inPlay: ['Hedge Knight']
            },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.completeChallengesPhase();
    });

    it('discards each character from play when the challenges phase ends', function () {
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('discard pile');
    });
});
