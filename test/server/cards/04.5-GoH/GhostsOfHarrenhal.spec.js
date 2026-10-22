describe('Ghosts of Harrenhal', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Ghosts of Harrenhal'],
                deadPile: ['Castle Guard', 'Hedge Knight']
            },
            player2: { deadPile: ['Tumblestone Knight'] }
        });
        this.player1.selectPlot('Ghosts of Harrenhal');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it("puts the top character in each player's dead pile into play", function () {
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.castleGuard.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.tumblestoneKnight).toBeControlledBy(this.player2);
        expect(this.player1).isReadyToTakeAction();
    });
});
