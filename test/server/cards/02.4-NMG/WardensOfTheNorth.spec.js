describe('Wardens of the North', function () {
    describe('during a challenge with a participating stark character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    plot: 'Wardens of the North',
                    inPlay: ['Tumblestone Knight', 'Winterfell Steward']
                }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu(
                this.player1Object.activePlot,
                'Kneel a character to have it participate in the current challenge'
            );
            this.player1.clickCard(this.winterfellSteward);
        });

        it('kneels another stark character to have it participate on your side', function () {
            expect(this.winterfellSteward.kneeled).toBe(true);
            expect(this.winterfellSteward.isAttacking()).toBe(true);
        });
    });
});
