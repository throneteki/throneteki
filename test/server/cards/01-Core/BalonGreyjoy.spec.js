describe('Balon Greyjoy (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Balon Greyjoy (Core)']
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.balonGreyjoy);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
    });

    it('stops each defending character with lower STR contributing its STR while he is attacking', function () {
        expect(this.game.currentChallenge.defenderStrength).toBe(0);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
