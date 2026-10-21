describe('The Greenblood', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                plot: 'Sailing the Summer Sea',
                inPlay: ['The Greenblood', 'House Dayne Knight']
            }
        });
    });

    it('gives each [martell] character you control +1 STR for each Summer plot revealed', function () {
        expect(this.houseDayneKnight.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
