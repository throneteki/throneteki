describe('The Knight of Flowers (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['The Knight of Flowers (Core)']
            },
            player2: {
                inPlay: ['Tumblestone Knight', 'Bastard in Hiding']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.theKnightOfFlowers);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickCard(this.bastardInHiding);
        this.player2.clickPrompt('Done');
    });

    it('stops the defending player declaring more than 1 defender while he attacks alone', function () {
        expect(this.game.currentChallenge.defenders).toEqual([this.tumblestoneKnight]);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
