describe('The Stone Drum', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'A Noble Cause',
                inPlay: ['The Stone Drum']
            }
        });
    });

    it('increases the gold on your revealed plot by 1 while there is a Kingdom plot revealed', function () {
        expect(this.player1Object.getIncome()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
