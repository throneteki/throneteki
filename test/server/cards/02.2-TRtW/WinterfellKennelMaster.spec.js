describe('Winterfell Kennel Master', function () {
    describe('during a challenge with a participating stark character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Winterfell Kennel Master', 'Tumblestone Knight', 'Grey Wind (Core)']
                }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu(
                this.winterfellKennelMaster,
                'Kneel a Direwolf to have it participate in the current challenge'
            );
            this.player1.clickCard(this.greyWind);
        });

        it('kneels a Direwolf to have it participate on your side', function () {
            expect(this.greyWind.kneeled).toBe(true);
            expect(this.greyWind.isAttacking()).toBe(true);
        });
    });
});
