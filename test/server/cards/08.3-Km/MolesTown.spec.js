describe("Mole's Town", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: "Mole's Town", gold: 1 },
                    'Tumblestone Knight',
                    'Eddard Stark (Core)'
                ]
            }
        });
        this.player1.clickCard(this.molesTown);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Military');
    });

    it('kneels to move 1 gold from itself to a character without gold, then stops that character attacking this phase', function () {
        expect(this.tumblestoneKnight.gold).toBe(1);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.eddardStark);
        this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
    });
});
