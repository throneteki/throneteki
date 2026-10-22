describe('White Harbor Galley', function () {
    describe('after it comes out of shadows during a challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Tumblestone Knight', 'Hedge Knight'],
                    shadows: ['White Harbor Galley']
                }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.whiteHarborGalley);
            this.player1.triggerAbility(this.whiteHarborGalley);
            this.player1.clickCard(this.hedgeKnight);
        });

        it('kneels a character you control to have it participate, and gives each participating character +1 STR', function () {
            expect(this.hedgeKnight.kneeled).toBe(true);
            expect(this.hedgeKnight.isParticipating()).toBe(true);
            expect(this.tumblestoneKnight.getStrength()).toBe(3);
        });
    });
});
