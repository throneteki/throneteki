describe('Ser Archibald Yronwood', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Ser Archibald Yronwood', kneeling: true }], gold: 0 },
            player2: { inPlay: ['Khal Drogo (Core)', 'Hot Pie (FFH)'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.serArchibaldYronwood);
        this.player2.clickCard(this.hotPie);
    });

    it('makes the opponent who wins dominance choose and kill a character they control', function () {
        expect(this.hotPie.location).toBe('dead pile');
        expect(this.khalDrogo.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
