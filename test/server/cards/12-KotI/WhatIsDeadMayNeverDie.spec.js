describe('What Is Dead May Never Die', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Khal Drogo (Core)'],
                hand: ['What Is Dead May Never Die'],
                deadPile: ['Lordsport Shipwright'],
                gold: 3
            }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.whatIsDeadMayNeverDie);
        this.player1.clickCard(this.lordsportShipwright);
    });

    it('puts a greyjoy character into play from your dead pile after you win dominance', function () {
        expect(this.lordsportShipwright.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
