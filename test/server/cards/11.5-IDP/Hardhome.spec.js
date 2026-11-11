describe('Hardhome', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hardhome'] },
            player2: { inPlay: ['Hot Pie (FFH)', { card: 'Khal Drogo (Core)', kneeling: true }] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.hardhome);
        this.player2.clickCard(this.hotPie);
    });

    it('kneels and sacrifices itself during dominance to have an opponent sacrifice a standing character', function () {
        expect(this.hardhome.location).toBe('discard pile');
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.khalDrogo.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
