describe('Balerion', function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Balerion (FH)', { card: 'Tumblestone Knight', gold: 1 }] }
            });
            this.player1.clickMenu(this.balerion, 'Discard 1 gold');
            this.player1.clickCard(this.tumblestoneKnight);
        });

        it('kneels to discard 1 gold from a card', function () {
            expect(this.tumblestoneKnight.gold).toBe(0);
            expect(this.balerion.kneeled).toBe(true);
            expect(this.balerion.allowGameAction('kill')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
