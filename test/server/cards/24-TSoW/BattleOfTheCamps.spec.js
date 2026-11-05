describe('Battle of the Camps (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Battle of the Camps (TSoW)',
                inPlay: ['Ser Jaime Lannister (Core)', 'Burned Men']
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
        this.player1.triggerAbility(this.battleOfTheCamps);
    });

    it('kneels a character the losing opponent controls after you win a military challenge as the attacker', function () {
        expect(this.player1).not.toBeAbleToSelect(this.burnedMen);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.kneeled).toBe(true);

        this.player2.clickCard(this.tumblestoneKnight);
        expect(this.player1).isReadyToTakeAction();
    });
});
