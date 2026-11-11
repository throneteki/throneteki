describe('Wardens of the Reach', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Wardens of the Reach', 'Rose Garden']
            }
        });
    });

    it('gets +1 STR for each The Reach location you control', function () {
        expect(this.wardensOfTheReach.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
