describe("Warrior's Sons (FotOG)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Warrior's Sons (FotOG)"] },
            player2: { power: 1, hand: ['"Lord Renly\'s Ride"'], gold: 1 }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.warriorsSons);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Pass');
        this.player2.clickCard(this.lordRenlysRide);
        this.player2.clickCard(this.warriorsSons);
        this.player1.triggerAbility(this.warriorsSons);
    });

    it("moves 1 power from an opponent's faction card to itself after they play an event during a challenge it participates in", function () {
        expect(this.warriorsSons.power).toBe(1);
        expect(this.player2Object.faction.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
