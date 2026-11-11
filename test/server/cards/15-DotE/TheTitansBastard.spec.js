describe("The Titan's Bastard", function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ["The Titan's Bastard"], discard: ['Brown Ben Plumm'] }
            });
            this.player1.clickMenu(this.theTitansBastard, 'Return a Mercenary');
            this.player1.clickCard(this.brownBenPlumm);
        });

        it('kneels to return a Mercenary character from your discard pile to your hand', function () {
            expect(this.theTitansBastard.kneeled).toBe(true);
            expect(this.brownBenPlumm.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
