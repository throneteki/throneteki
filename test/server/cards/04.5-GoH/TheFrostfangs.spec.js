describe('The Frostfangs', function () {
    describe('after it enters play', function () {
        beforeEach(function () {
            this.setupTest({ phase: 'marshal', player1: { hand: ['The Frostfangs'] } });
            this.reserveBefore = this.player2Object.getReserve();
            this.player1.clickCard(this.theFrostfangs);
            this.player1.triggerAbility(this.theFrostfangs);
        });

        it('gives control of itself to an opponent, lowering their reserve by 1', function () {
            expect(this.theFrostfangs).toBeControlledBy(this.player2);
            expect(this.player2Object.getReserve()).toBe(this.reserveBefore - 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
