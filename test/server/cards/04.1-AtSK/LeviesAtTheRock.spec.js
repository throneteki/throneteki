describe('Levies at the Rock', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Levies at the Rock'], gold: 0 },
            player2: { inPlay: ['Khal Drogo (Core)', 'Burned Men'], gold: 3 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.leviesAtTheRock);
    });

    it("moves up to 1 gold for each attacking character from the attacking player's gold pool to yours after they initiate a challenge against you", function () {
        expect(this.player1Object.gold).toBe(2);
        expect(this.player2Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
