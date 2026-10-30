describe("Reaver's Greataxe", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Salty Navigator', attachments: ["Reaver's Greataxe"] }]
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.saltyNavigator);
        this.player1.clickPrompt('Done');
    });

    it('gives the attached character the Raider trait, and stops it kneeling in your first challenge against an opponent with fewer attachments', function () {
        expect(this.saltyNavigator.hasTrait('Raider')).toBe(true);
        expect(this.saltyNavigator.kneeled).toBe(false);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
