describe('Peace and Prosperity', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Peace and Prosperity',
                hand: ['Tumblestone Knight', 'Heart Tree Grove', 'Little Bird (Core)']
            }
        });
    });

    it('reduces the cost of the first character by 3, location by 2 and attachment by 1', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.heartTreeGrove);
        this.player1.clickCard(this.littleBird);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.heartTreeGrove.location).toBe('play area');
        expect(this.littleBird.location).toBe('play area');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1Object.gold).toBe(
            2 - Math.max(0, this.heartTreeGrove.getPrintedCost() - 2)
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
