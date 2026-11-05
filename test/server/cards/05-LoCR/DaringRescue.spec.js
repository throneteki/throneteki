describe('Daring Rescue', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight', 'Steward at the Wall'], hand: ['Daring Rescue'] }
        });
        this.player1.clickCard(this.daringRescue);
        this.player1.clickCard(this.stewardAtTheWall);
        this.player1.clickCard(this.hedgeKnight);
    });

    it("returns a character you control to its owner's hand, then a Knight you control gains 1 power", function () {
        expect(this.stewardAtTheWall.location).toBe('hand');
        expect(this.hedgeKnight.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
