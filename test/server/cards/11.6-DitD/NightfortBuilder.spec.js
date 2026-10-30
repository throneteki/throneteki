describe('Nightfort Builder', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Nightfort Builder'],
                drawDeck: ['Longclaw']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.nightfortBuilder);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.nightfortBuilder);
    });

    it('reveals the top card of your deck after it is knelt, and draws a [thenightswatch] location or attachment', function () {
        expect(this.longclaw.location).toBe('hand');

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
