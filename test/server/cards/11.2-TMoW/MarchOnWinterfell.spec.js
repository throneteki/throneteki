describe('March on Winterfell', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Robb Stark (Core)', 'Tumblestone Knight'],
                hand: ['March on Winterfell']
            }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.challenge = this.game.currentChallenge;
        this.player1.clickCard(this.marchOnWinterfell);
    });

    it('ends the challenge and lets you initiate an additional power challenge', function () {
        expect(this.challenge.cancelled).toBe(true);
        this.player2.clickPrompt('Pass');
        expect(this.player1).not.toHaveDisabledPromptButton('Power');
        expect(this.player1).isReadyToTakeAction();
    });
});
