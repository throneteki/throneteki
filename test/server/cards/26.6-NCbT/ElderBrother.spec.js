describe('Elder Brother', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                plot: 'The Warrior (HMW)',
                inPlay: ['Elder Brother']
            }
        });
    });

    it('cannot be killed while you have a The Seven plot revealed', function () {
        expect(this.elderBrother.allowGameAction('kill')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
