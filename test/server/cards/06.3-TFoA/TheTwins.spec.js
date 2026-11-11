describe('The Twins', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['The Twins', 'Black Walder', 'Tumblestone Knight', 'House Maester']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        this.unopposedChallenge(this.player1, 'Intrigue', this.houseMaester);
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.blackWalder);
        this.player1.clickPrompt('Done');
    });

    it('raises the claim on your revealed plot by 1 during your third challenge if you control an attacking House Frey character', function () {
        expect(this.player1Object.getClaim()).toBe(2);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
