describe('Sneak Attack', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Sneak Attack',
                inPlay: ['Tumblestone Knight', 'Bastard in Hiding']
            }
        });
    });

    it('stops you initiating more than 1 challenge', function () {
        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);

        expect(this.player1).toHaveDisabledPromptButton('Military');
        expect(this.player1).toHaveDisabledPromptButton('Intrigue');
        expect(this.player1).isReadyToTakeAction();
    });
});
