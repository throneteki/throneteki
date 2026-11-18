describe('the prompt to initiate a challenge', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Hedge Knight']
            }
        });
    });

    it('asks the first player whether to initiate a challenge', function () {
        expect(this.player1).toHavePrompt('Initiate a challenge?');
        expect(this.player2).toHavePrompt('Waiting for opponent to initiate challenge');
        expect(this.player1).isReadyToTakeAction();
    });
});
