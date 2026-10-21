describe('Darkstar (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Darkstar (SoD)', 'Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.darkstar);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.darkstar);
    });

    it("sacrifices himself while attacking to return each participating character to its owner's hand", function () {
        expect(this.darkstar.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('hand');

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
