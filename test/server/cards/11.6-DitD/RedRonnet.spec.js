describe('Red Ronnet', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Red Ronnet']
            },
            player2: {
                shadows: ['Ser Andrey Dalt']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.redRonnet);
        this.player1.clickPrompt('Done');
    });

    it('raises the claim on your revealed plot by 1 while he attacks a player with a card in shadows', function () {
        expect(this.player1Object.getClaim()).toBe(2);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
