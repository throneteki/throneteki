describe('Tithe Collector', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { faction: 'lannister', inPlay: ['Tithe Collector'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.titheCollector);
    });

    it('pays 2 gold to gain 1 power after you collect income', function () {
        expect(this.titheCollector.power).toBe(1);
        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
