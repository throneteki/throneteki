describe('Sailing the Summer Sea', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Sailing the Summer Sea',
                inPlay: ['Tumblestone Knight', 'Bastard in Hiding']
            }
        });
    });

    it('lets you initiate an additional [power] challenge, but no [military] or [intrigue] challenges', function () {
        expect(this.player1).toHaveDisabledPromptButton('Military');
        expect(this.player1).toHaveDisabledPromptButton('Intrigue');

        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);

        expect(this.player1).not.toHaveDisabledPromptButton('Power');

        this.unopposedChallenge(this.player1, 'Power', this.bastardInHiding);

        expect(this.player1).toHaveDisabledPromptButton('Power');
        expect(this.player1).isReadyToTakeAction();
    });
});
