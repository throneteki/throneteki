describe('Drowned Disciple (R)', function () {
    describe('after a character enters play from your dead pile', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Drowned Disciple (R)', "Drowned God's Apostle"],
                    deadPile: ['Iron Islands Fishmonger']
                }
            });
            this.player1.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.triggerAbility(this.drownedGodsApostle);
            this.player1.clickCard(this.ironIslandsFishmonger);
            this.player1.triggerAbility(this.drownedDisciple);
            this.player1.clickCard(this.drownedDisciple);
        });

        it('has a Drowned God character gain 1 power', function () {
            expect(this.ironIslandsFishmonger.location).toBe('play area');
            expect(this.drownedDisciple.power).toBe(1);
        });
    });
});
