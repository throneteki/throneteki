describe('Citadel Novice', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Citadel Novice'],
                drawDeck: ['Little Bird (Core)']
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.citadelNovice);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.citadelNovice);
    });

    it('reveals the top card of your deck after it is knelt, and draws it if it is an attachment or Maester', function () {
        expect(this.littleBird.location).toBe('hand');

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
