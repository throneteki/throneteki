describe('an ability with several targets', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ["The Hatchlings' Feast"], gold: 5 },
            player2: { inPlay: ['Hedge Knight', 'Robb Stark (Core)', 'Ranging Party'] }
        });
        this.player1.clickCard(this.theHatchlingsFeast);
        this.player1.clickCard(this.hedgeKnight);
    });

    it('lets a later target rule out a card chosen for an earlier target', function () {
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).toBeAbleToSelect(this.robbStark);
    });
});
