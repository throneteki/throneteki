describe('Visited by Shadows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Visited by Shadows'],
                inPlay: ['Grand Maester Pycelle (Core)']
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.visitedByShadows);
    });

    it("can only be attached to an opponent's character, which gets -1 STR", function () {
        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
        expect(this.player1).not.toBeAbleToSelect(this.grandMaesterPycelle);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.getStrength()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
