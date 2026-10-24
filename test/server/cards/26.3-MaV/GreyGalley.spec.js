describe('Grey Galley (MaV)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Grey Galley (MaV)', 'Bastard in Hiding']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.bastardInHiding);
        this.player2.clickPrompt('Done');
    });

    it('contributes 1 STR to your side while you control a defending character', function () {
        expect(this.game.currentChallenge.defenderStrength).toBe(3);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
