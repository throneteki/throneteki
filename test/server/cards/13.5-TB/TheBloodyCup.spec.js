describe('"The Bloody Cup"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['"The Bloody Cup"'], inPlay: ['Ser Jaime Lannister (Core)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
        this.player1.triggerAbility(this.theBloodyCup);
    });

    it("places a character the losing opponent controls on top of its owner's deck after you win an unopposed challenge", function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
