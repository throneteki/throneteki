describe("Littlefinger's Meddling (R)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: "Littlefinger's Meddling (R)",
                hand: ['Nightmares']
            },
            player2: {
                inPlay: ['House Maester']
            }
        });
    });

    it('reduces the cost of the first event you play each phase by 2', function () {
        this.player1.clickCard(this.nightmares);
        this.player1.clickCard(this.houseMaester);

        expect(this.nightmares.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
