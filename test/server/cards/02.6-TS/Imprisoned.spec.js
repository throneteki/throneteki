describe('Imprisoned', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Imprisoned'],
                inPlay: ['Grand Maester Pycelle (Core)']
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.imprisoned);
    });

    it("can only be attached to an opponent's character, which loses a [military] icon", function () {
        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
        expect(this.player1).not.toBeAbleToSelect(this.grandMaesterPycelle);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.hasIcon('military')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
