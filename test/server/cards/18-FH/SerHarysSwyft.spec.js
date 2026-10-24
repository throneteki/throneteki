describe('Ser Harys Swyft (FH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Ser Harys Swyft (FH)', 'Tumblestone Knight'] }
        });
        expect(this.player1Object.gold).toBe(6);
        this.player1.clickCard(this.serHarysSwyft);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('raises your income by 1, and moves 1 gold from your gold pool to a card without gold', function () {
        expect(this.tumblestoneKnight.gold).toBe(1);
        expect(this.player1Object.gold).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
