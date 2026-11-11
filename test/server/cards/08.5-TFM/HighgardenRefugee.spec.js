describe('Highgarden Refugee', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Sailing the Summer Sea',
                hand: ['Highgarden Refugee']
            }
        });
    });

    it('costs 1 less to marshal while there is a Summer plot revealed', function () {
        this.player1.clickCard(this.highgardenRefugee);

        expect(this.highgardenRefugee.location).toBe('play area');
        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
