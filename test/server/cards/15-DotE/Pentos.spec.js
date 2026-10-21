describe('Pentos', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: ['Pentos', 'Targaryen Loyalist'],
                drawDeck: ['Little Bird (Core)', 'Tumblestone Knight', 'House Maester']
            }
        });

        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.pentos);
    });

    it('kneels to put a drawn attachment into play, then draws a card', function () {
        this.player1.clickCard(this.targaryenLoyalist);

        expect(this.pentos.kneeled).toBe(true);
        expect(this.littleBird.parent).toBe(this.targaryenLoyalist);
        expect(this.houseMaester.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
