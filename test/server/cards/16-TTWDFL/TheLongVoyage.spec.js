describe('The Long Voyage', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                agenda: 'The Long Voyage'
            }
        });

        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.theLongVoyage);
    });

    it('kneels your faction card to draw 1 card after you draw cards in the draw phase', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
