describe('Veteran Builder', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Veteran Builder', { card: "Brandon's Gift", kneeling: true }]
            }
        });
        this.player1.clickCard(this.veteranBuilder);
        this.player1.clickCard(this.brandonsGift);
    });

    it('sacrifices itself to stand a location', function () {
        expect(this.veteranBuilder.location).toBe('discard pile');
        expect(this.brandonsGift.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
