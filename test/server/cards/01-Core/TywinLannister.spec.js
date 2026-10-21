describe('Tywin Lannister (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Tywin Lannister (Core)']
            }
        });
    });

    it('gets +1 STR for each gold in your gold pool, and gives +2 income', function () {
        expect(this.player1Object.gold).toBe(7);
        expect(this.tywinLannister.getStrength()).toBe(13);
        expect(this.player1).isReadyToTakeAction();
    });
});
