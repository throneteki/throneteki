describe('Tyene Sand (TS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tyene Sand (TS)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.tyeneSand);
        this.player1.triggerAbility(this.tyeneSand);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('poisons a character without an intrigue icon after she wins an intrigue challenge as an attacker', function () {
        expect(this.tumblestoneKnight.location).toBe('play area');

        this.completeChallengesPhase();

        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
