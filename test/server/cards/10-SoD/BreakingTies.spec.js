describe('Breaking Ties (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { plot: 'Breaking Ties (SoD)', inPlay: ['Messenger Raven'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.breakingTies);
        this.player1.clickCard(this.messengerRaven);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("sacrifices a loyal character to return a non-loyal character or location to its owner's hand", function () {
        expect(this.messengerRaven.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
