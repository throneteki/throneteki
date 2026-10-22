describe('Take the Black', function () {
    describe('during the dominance phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { hand: ['Take the Black'] },
                player2: {
                    inPlay: ['Dothraki Outriders', 'Maester Aemon (Core)', 'Wildling Horde']
                }
            });
            this.player1.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.clickCard(this.takeTheBlack);
        });

        it('takes control of a non-unique character with printed cost 6 or lower', function () {
            expect(this.player1).toBeAbleToSelect(this.wildlingHorde);
            expect(this.player1).not.toBeAbleToSelect(this.maesterAemon);
            expect(this.player1).not.toBeAbleToSelect(this.dothrakiOutriders);
            this.player1.clickCard(this.wildlingHorde);
            expect(this.wildlingHorde).toBeControlledBy(this.player1);
        });
    });
});
