describe('Willas Tyrell (FUtG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Willas Tyrell (FUtG)', 'Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('contributes his STR during a challenge in which a character you control attacks alone', function () {
        expect(this.game.currentChallenge.attackerStrength).toBe(4);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
