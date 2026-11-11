describe('Uniting the Seven Kingdoms', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Uniting the Seven Kingdoms',
                hand: ['House Dayne Knight', 'Tumblestone Knight']
            }
        });
    });

    it('increases the cost of out-of-faction cards you marshal by 1', function () {
        this.player1.clickCard(this.houseDayneKnight);

        expect(this.houseDayneKnight.location).toBe('play area');
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not increase the cost of in-faction cards', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player1Object.gold).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
