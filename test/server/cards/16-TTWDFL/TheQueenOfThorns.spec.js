describe('The Queen of Thorns (TTWDFL)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['House Maester']
            },
            player2: {
                inPlay: ['The Queen of Thorns (TTWDFL)']
            }
        });
    });

    it('stops opponents initiating [intrigue] challenges against you while she is standing', function () {
        expect(this.player1).toHaveDisabledPromptButton('Intrigue');
        expect(this.player1).isReadyToTakeAction();
    });
});
