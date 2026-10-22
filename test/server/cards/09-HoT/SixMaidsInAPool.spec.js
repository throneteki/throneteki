describe('Six Maids in a Pool', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Catelyn Stark (Core)', 'Margaery Tyrell (Core)'],
                    hand: ['"Six Maids in a Pool"']
                }
            });
            this.handBefore = this.player1Object.hand.length;
            this.player1.clickCard(this.sixMaidsInAPool);
        });

        it('draws 1 card for each Lady character you control', function () {
            expect(this.player1Object.hand).toHaveLength(this.handBefore - 1 + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
