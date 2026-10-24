describe('Salty Navigator', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Salty Navigator']
            }
        });
    });

    it('gives +1 initiative', function () {
        expect(this.player1Object.getInitiative()).toBe(1);
        expect(this.player2Object.getInitiative()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
