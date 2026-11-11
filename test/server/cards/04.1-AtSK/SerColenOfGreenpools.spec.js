describe('Ser Colen of Greenpools', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Colen of Greenpools']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.serColenOfGreenpools);
        this.player1.clickPrompt('Done');
    });

    it('gets +3 STR during [power] challenges', function () {
        expect(this.serColenOfGreenpools.getStrength()).toBe(4);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
