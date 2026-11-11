describe('Jousting Knight', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Jousting Knight', 'Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.joustingKnight);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('does not contribute its STR unless attacking or defending alone', function () {
        expect(this.game.currentChallenge.attackerStrength).toBe(2);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
