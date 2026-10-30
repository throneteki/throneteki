describe("A Lannister's Honor (WK)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ["A Lannister's Honor (WK)"], inPlay: ['Cersei Lannister (Core)'] },
            player2: { inPlay: ['Tumblestone Knight', 'Ser Jaime Lannister (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
        this.player1.triggerAbility(this.aLannistersHonor);
    });

    it('has the losing opponent kill a character with the lowest STR among characters they control after you win an intrigue challenge as the attacker', function () {
        expect(this.player2).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
