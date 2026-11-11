describe("Storm's End Maester", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Storm's End Maester"], power: 1 }
        });
        this.player1.clickCard(this.stormsEndMaester);
    });

    it('kneels to draw 1 card if you have more faction power than an opponent', function () {
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
