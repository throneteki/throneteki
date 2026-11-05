describe('Take to the Sky!', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Drogon (DotE)'],
                hand: ['Take to the Sky!']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.drogon);
    });

    it('saves a Dragon from being killed and returns it to its owner hand', function () {
        this.player1.triggerAbility(this.takeToTheSky);

        expect(this.drogon.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
