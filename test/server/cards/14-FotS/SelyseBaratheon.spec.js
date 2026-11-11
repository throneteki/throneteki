describe('Selyse Baratheon (FotS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Selyse Baratheon (FotS)'],
                hand: ["Red God's Blessing", 'Little Bird (Core)']
            }
        });
    });

    it("reduces the cost of each R'hllor attachment you marshal by 3", function () {
        this.player1.clickCard(this.redGodsBlessing);
        this.player1.clickCard(this.selyseBaratheon);

        expect(this.redGodsBlessing.location).toBe('play area');
        expect(this.player1Object.gold).toBe(5);

        this.player1.clickCard(this.littleBird);
        this.player1.clickCard(this.selyseBaratheon);

        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
