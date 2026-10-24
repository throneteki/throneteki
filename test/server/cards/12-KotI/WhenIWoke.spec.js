describe('When I Woke...', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['When I Woke...'], inPlay: ['Tumblestone Knight'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.whenIWoke);
    });

    it("has the player who lost a military challenge place a participating character on top of its owner's deck", function () {
        this.player1.clickCard(this.serJaimeLannister);

        expect(this.serJaimeLannister.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
