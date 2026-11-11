describe("Olenna's Informant", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight', 'Eddard Stark (Core)'],
                hand: ["Olenna's Informant"],
                gold: 4
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.olennasInformant);
        this.player1.triggerAbility(this.olennasInformant);
        this.player1.clickPrompt('Military');
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('lets you initiate an additional challenge of the named type this phase after it enters play during the challenges phase', function () {
        expect(this.player1).not.toHaveDisabledPromptButton('Military');

        this.unopposedChallenge(this.player1, 'Military', this.eddardStark);

        expect(this.player1).toHaveDisabledPromptButton('Military');
        expect(this.player1).isReadyToTakeAction();
    });
});
