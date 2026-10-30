describe('Bear Island', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Bear Island'], hand: ['Highgarden (Core)'], gold: 3 }
        });
        this.player1.clickCard(this.highgarden);
        this.player1.triggerAbility(this.bearIsland);
    });

    it('gains 1 gold after you marshal a loyal card', function () {
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
