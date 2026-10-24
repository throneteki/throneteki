describe('Conquer', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Conquer']
            },
            player2: {
                inPlay: ['Heart Tree Grove', 'Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.conquer);
    });

    it('can only be attached to a location, and takes control of it', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.heartTreeGrove);

        expect(this.heartTreeGrove.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
