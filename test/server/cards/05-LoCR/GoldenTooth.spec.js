describe('Golden Tooth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Golden Tooth']
            }
        });

        this.player1.clickCard(this.goldenTooth);
    });

    it('kneels to gain 3 gold while an opponent has no cards in hand', function () {
        expect(this.goldenTooth.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(8);
        expect(this.player1).isReadyToTakeAction();
    });
});
