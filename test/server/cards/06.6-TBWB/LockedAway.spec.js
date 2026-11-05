describe('Locked Away', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: [{ card: 'Hedge Knight', attachments: ['Locked Away'] }] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility('Locked Away');
    });

    it("returns the attached character to its owner's hand when the marshaling phase begins", function () {
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.lockedAway.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
