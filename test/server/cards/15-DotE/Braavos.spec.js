describe('Braavos', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Braavos', 'Tumblestone Knight', 'Khal Drogo (Core)'], gold: 0 }
        });
        this.player1.clickCard(this.braavos);
    });

    it('kneels to gain 1 gold for each different faction among characters you control', function () {
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
