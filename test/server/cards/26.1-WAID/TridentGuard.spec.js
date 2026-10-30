describe('Trident Guard (WAID)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                plot: 'Sneak Attack',
                inPlay: ['Trident Guard (WAID)']
            }
        });
    });

    it("gains renown while your claim is higher than an opponent's", function () {
        expect(this.tridentGuard.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
