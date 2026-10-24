describe('The Red Wedding', function () {
    describe('when you win a challenge as the attacker', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { plot: 'The Red Wedding', inPlay: ['Catelyn Stark (WotN)'] },
                player2: { inPlay: ['Robb Stark (Core)'] }
            });
            this.unopposedChallenge(this.player1, 'Power', this.catelynStark);
            this.player1.triggerAbility(this.theRedWedding);
            this.player1.clickCard(this.robbStark);
        });

        it('kills a Lord or Lady controlled by the losing opponent', function () {
            expect(this.robbStark.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the opponent wins a challenge as the attacker', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { plot: 'The Red Wedding', inPlay: ['Catelyn Stark (WotN)'] },
                player2: { inPlay: ['Robb Stark (Core)'] }
            });
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Power', this.robbStark);
            this.player2.triggerAbility(this.theRedWedding);
            this.player2.clickCard(this.catelynStark);
        });

        it('lets them kill a Lord or Lady you control', function () {
            expect(this.catelynStark.location).toBe('dead pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
