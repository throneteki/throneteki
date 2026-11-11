describe('Kingsmoot', function () {
    describe('after you win dominance', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['The Drumm'], hand: ['Kingsmoot'] }
            });
            this.player1.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.clickCard(this.kingsmoot);
            this.player1.clickCard(this.theDrumm);
        });

        it('has a unique greyjoy character gain 1 power for each unique greyjoy character you control', function () {
            expect(this.theDrumm.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
