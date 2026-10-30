describe("King Robert's Legacy", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ["King Robert's Legacy"], inPlay: ['Robert Baratheon (Core)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.robertBaratheon);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.kingRobertsLegacy);
    });

    it('takes control of a kneeling defending character after you win a challenge with an attacking King', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
