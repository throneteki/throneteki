describe('Jon Snow (Core)', function () {
    describe('while he is standing', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Jon Snow (Core)', 'Old Forest Hunter'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.oldForestHunter);
            this.player1.clickPrompt('Done');
        });

        it("is considered to be participating in each challenge in which you control another attacking Night's Watch character", function () {
            expect(this.jonSnow.isParticipating()).toBe(true);
            expect(this.jonSnow.kneeled).toBe(false);
        });
    });
});
