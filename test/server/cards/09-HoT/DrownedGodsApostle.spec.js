describe("Drowned God's Apostle", function () {
    describe('after you win dominance', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ["Drowned God's Apostle"],
                    deadPile: ['Iron Islands Fishmonger']
                }
            });
            this.player1.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.triggerAbility(this.drownedGodsApostle);
            this.player1.clickCard(this.ironIslandsFishmonger);
        });

        it('kills itself to put a cheap greyjoy character into play from your dead pile', function () {
            expect(this.drownedGodsApostle.location).toBe('dead pile');
            expect(this.ironIslandsFishmonger.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
