describe('Arianne Martell (JtO)', function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Arianne Martell (JtO)'] },
                player2: { inPlay: ['Hedge Knight'] }
            });
            this.player1.clickMenu(this.arianneMartell, 'Return character to hand');
            this.player1.clickCard(this.hedgeKnight);
        });

        it("returns herself to your hand to return a character with lower STR to its owner's hand", function () {
            expect(this.arianneMartell.location).toBe('hand');
            expect(this.hedgeKnight.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
