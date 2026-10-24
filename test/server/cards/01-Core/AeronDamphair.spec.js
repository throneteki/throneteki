describe('Aeron Damphair (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Aeron Damphair (Core)'], deadPile: ['Lordsport Shipwright'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.aeronDamphair);
        this.player1.clickCard(this.lordsportShipwright);
    });

    it('puts an Ironborn character into play from your dead pile after you win dominance', function () {
        expect(this.lordsportShipwright.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
