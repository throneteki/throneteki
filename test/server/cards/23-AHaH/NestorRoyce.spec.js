describe('Nestor Royce', function () {
    describe('after you win a challenge he participates in', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Nestor Royce (AHaH)', 'The Kingsroad'] }
            });
            this.unopposedChallenge(this.player1, 'Power', this.nestorRoyce);
            this.player1.triggerAbility(this.nestorRoyce);
            this.player1.clickCard(this.theKingsroad);
        });

        it('kneels a neutral location to give him renown until the end of the challenge', function () {
            this.player1.clickPrompt('Renown');
            expect(this.theKingsroad.kneeled).toBe(true);
            expect(this.nestorRoyce.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
