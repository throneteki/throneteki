describe('Greywater Watch', function () {
    describe('during a challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Greywater Watch (JS)', 'Tumblestone Knight', 'Winterfell Steward']
                }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu(this.greywaterWatch, 'Kneel a character to have it participate');
            this.player1.clickCard(this.winterfellSteward);
        });

        it('returns itself to shadows and kneels a stark character to have it participate on your side', function () {
            expect(this.greywaterWatch.location).toBe('shadows');
            expect(this.winterfellSteward.kneeled).toBe(true);
            expect(this.winterfellSteward.isAttacking()).toBe(true);
        });
    });
});
