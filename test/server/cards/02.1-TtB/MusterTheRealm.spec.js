describe('Muster the Realm', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Muster the Realm',
                inPlay: ['Vanguard of the North']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.vanguardOfTheNorth);
        this.player1.clickPrompt('Done');
    });

    it('raises its claim by 1 while you control an attacking Army character', function () {
        expect(this.player1Object.getClaim()).toBe(2);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
