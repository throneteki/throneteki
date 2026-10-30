describe("Littlefinger's Meddling (LoCR)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: "Littlefinger's Meddling (LoCR)",
                hand: ['Nightmares']
            },
            player2: {
                inPlay: ['House Maester']
            }
        });
    });

    it('reduces the cost of each event you play by 2', function () {
        this.player1.clickCard(this.nightmares);
        this.player1.clickCard(this.houseMaester);

        expect(this.nightmares.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
