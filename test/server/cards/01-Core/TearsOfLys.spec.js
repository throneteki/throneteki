describe('Tears of Lys', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Tears of Lys'], inPlay: ['Littlefinger (Core)'], gold: 1 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.littlefinger);
        this.player1.triggerAbility(this.tearsOfLys);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('poisons a character without an intrigue icon controlled by the losing opponent after you win an intrigue challenge as the attacker', function () {
        expect(this.tumblestoneKnight.location).toBe('play area');

        this.completeChallengesPhase();

        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
