describe('Obara Sand (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: [{ card: 'Obara Sand (Core)', kneeling: true }]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('may be declared as a defender in [power] challenges while kneeling', function () {
        this.player2.clickCard(this.obaraSand);
        this.player2.clickPrompt('Done');

        expect(this.game.currentChallenge.defenders).toContain(this.obaraSand);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
