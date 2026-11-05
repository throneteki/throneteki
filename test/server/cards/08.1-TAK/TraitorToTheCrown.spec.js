describe('Traitor to the Crown', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: [
                    {
                        card: 'Bastard in Hiding',
                        attachments: [{ card: 'Traitor to the Crown', owner: 'player1' }]
                    }
                ]
            }
        });
    });

    it("stops the attached character contributing to [power] challenges or to its controller's dominance", function () {
        expect(this.player2Object.getDominance()).toBe(this.player2Object.gold);

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.bastardInHiding);
        this.player2.clickPrompt('Done');

        expect(this.game.currentChallenge.defenderStrength).toBe(0);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
