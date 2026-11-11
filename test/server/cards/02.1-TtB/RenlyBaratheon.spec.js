describe('Renly Baratheon (TtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 6,
                hand: ['Bastard in Hiding', 'Tumblestone Knight', 'House Dayne Knight'],
                inPlay: ['Renly Baratheon (TtB)']
            }
        });
    });

    it('reduces the cost of the first non-[baratheon] character you marshal by 1, and only that one', function () {
        this.player1.clickCard(this.bastardInHiding);

        expect(this.player1Object.gold).toBe(4);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player1Object.gold).toBe(3);

        this.player1.clickCard(this.houseDayneKnight);

        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
