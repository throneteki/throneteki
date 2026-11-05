describe('Southron Messenger', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                hand: ['Southron Messenger'],
                inPlay: ['Burned Men'],
                gold: 5
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.southronMessenger);
        this.player1.triggerAbility(this.southronMessenger);
        this.player1.clickCard(this.burnedMen);
    });

    it("returns a participating character with fewer than 2 challenge icons to its owner's hand after it enters play during a challenge", function () {
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
