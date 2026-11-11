describe('Eastwatch Carpenter', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Eastwatch Carpenter', 'The Haunted Forest', 'The Haunted Forest'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility('Eastwatch Carpenter');
    });

    it('gains 1 gold for every 2 [thenightswatch] locations you control after you collect income', function () {
        expect(this.player1Object.gold).toBe(5 + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
