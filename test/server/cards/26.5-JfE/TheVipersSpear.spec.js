describe("The Viper's Spear", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Obara Sand (Core)', attachments: ["The Viper's Spear"] }]
            },
            player2: {
                inPlay: ['Tumblestone Knight', 'Bastard in Hiding']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.obaraSand);
        this.player1.clickPrompt('Done');
    });

    it('gives +3 STR in [military] challenges and stops the attached character kneeling against an opponent with more characters', function () {
        expect(this.obaraSand.getStrength()).toBe(6);
        expect(this.obaraSand.kneeled).toBe(false);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.player1).isReadyToTakeAction();
    });
});
