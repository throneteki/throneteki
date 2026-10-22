describe('Poisoned Locusts', function () {
    describe('while the attached character is participating', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { shadows: ['Poisoned Locusts'] },
                player2: { inPlay: ['Steward at the Wall'] }
            });
            this.player1.clickCard(this.poisonedLocusts);
            this.player1.clickCard(this.stewardAtTheWall);
            this.completeMarshalPhase();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Intrigue');
            this.player2.clickCard(this.stewardAtTheWall);
            this.player2.clickPrompt('Done');
        });

        it('gives it -1 STR for each attachment and kills it at 0 STR', function () {
            expect(this.stewardAtTheWall.location).toBe('dead pile');
        });
    });
});
