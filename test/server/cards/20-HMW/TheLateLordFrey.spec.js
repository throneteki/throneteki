describe('The Late Lord Frey', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'The Late Lord Frey',
                hand: ['Black Walder'],
                inPlay: ['Tumblestone Knight']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.theLateLordFrey);
    });

    it('puts a House Frey card into play from your hand after you initiate a challenge', function () {
        this.player1.clickCard(this.blackWalder);
        this.player1.clickPrompt('Done');

        expect(this.blackWalder.location).toBe('play area');

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });
});
