describe('Little Bird (TIC)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { shadows: ['Little Bird (TIC)'], gold: 1 } });
        this.player1.clickCard(this.littleBird);
        this.player1.triggerAbility(this.littleBird);
    });

    it("looks at the top card of an opponent's deck after it comes out of shadows, then each of you may draw 1 card", function () {
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Yes');
        this.player2.clickPrompt('Yes');

        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player2Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
