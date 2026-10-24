describe('Oldtown Scholar', function () {
    describe('after an opponent draws cards outside the draw phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Oldtown Scholar'] },
                player2: { inPlay: ['Catelyn Stark (Core)'], hand: ['"Six Maids in a Pool"'] }
            });
            this.player1.clickPrompt('Done');
            this.handBefore = this.player1Object.hand.length;
            this.player2.clickCard(this.sixMaidsInAPool);
            this.player1.triggerAbility(this.oldtownScholar);
        });

        it('kneels to draw that many cards', function () {
            expect(this.player1Object.hand).toHaveLength(this.handBefore + 1);
            expect(this.oldtownScholar.kneeled).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
