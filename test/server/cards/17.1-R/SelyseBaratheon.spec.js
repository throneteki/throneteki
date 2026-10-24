describe('Selyse Baratheon (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Selyse Baratheon (R)'],
                hand: ["Red God's Blessing"]
            }
        });
    });

    it("reduces the cost of the first R'hllor attachment you marshal each round by 3", function () {
        this.player1.clickCard(this.redGodsBlessing);
        this.player1.clickCard(this.selyseBaratheon);

        expect(this.redGodsBlessing.location).toBe('play area');
        expect(this.player1Object.gold).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
