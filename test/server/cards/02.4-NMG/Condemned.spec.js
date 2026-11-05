describe('Condemned', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Condemned'],
                inPlay: ['Grand Maester Pycelle (Core)']
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });

        this.player1.clickCard(this.condemned);
    });

    it("can only be attached to an opponent's character, which loses a [power] icon", function () {
        expect(this.player1).toBeAbleToSelect(this.bastardInHiding);
        expect(this.player1).not.toBeAbleToSelect(this.grandMaesterPycelle);

        this.player1.clickCard(this.bastardInHiding);

        expect(this.bastardInHiding.hasIcon('power')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
