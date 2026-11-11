describe('Strangler', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Khal Drogo (Core)', attachments: ['Strangler'] }]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
    });

    it("sets the attached character's STR to 1 while it participates", function () {
        expect(this.khalDrogo.getStrength()).toBe(1);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
