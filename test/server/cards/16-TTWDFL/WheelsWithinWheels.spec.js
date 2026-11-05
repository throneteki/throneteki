describe('Wheels Within Wheels (TTWDFL)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Tywin Lannister (Core)'],
                hand: ['Wheels Within Wheels (TTWDFL)'],
                plotDeck: ['A Noble Cause']
            }
        });
        this.player1.clickCard(this.wheelsWithinWheels);
        this.player1.clickCard(this.tywinLannister);
        this.player1.clickCard(this.aNobleCause);
    });

    it('kneels a unique lannister character to reveal a new plot', function () {
        expect(this.tywinLannister.kneeled).toBe(true);
        expect(this.player1Object.activePlot).toBe(this.aNobleCause);
        expect(this.player1).isReadyToTakeAction();
    });
});
