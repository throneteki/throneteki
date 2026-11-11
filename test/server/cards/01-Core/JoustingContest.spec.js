describe('Jousting Contest (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Jousting Contest (Core)',
                inPlay: ['Tumblestone Knight', 'Bastard in Hiding']
            }
        });
    });

    it('stops each player declaring more than 1 attacker', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.bastardInHiding);
        this.player1.clickPrompt('Done');

        expect(this.game.currentChallenge.attackers).toEqual([this.tumblestoneKnight]);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
