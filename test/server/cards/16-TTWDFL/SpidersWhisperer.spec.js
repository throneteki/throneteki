describe("Spider's Whisperer", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ["Spider's Whisperer"] },
            player2: { inPlay: ['Jalabhar Xho', 'Tumblestone Knight'] }
        });
        this.player1.clickCard(this.spidersWhisperer);
    });

    it('is forced to discard an Ally character from play after it enters play', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.jalabharXho);

        expect(this.jalabharXho.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
