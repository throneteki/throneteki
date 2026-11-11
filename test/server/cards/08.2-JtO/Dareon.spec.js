describe('Dareon', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Dareon'], hand: ['"Lord Renly\'s Ride"'], gold: 1 },
            player2: { gold: 1 }
        });
        this.player1.clickCard(this.lordRenlysRide);
        this.player1.clickCard(this.dareon);
        this.player1.triggerAbility(this.dareon);
    });

    it("moves 1 gold from an opponent's gold pool to yours after you play a Song event", function () {
        expect(this.player1Object.gold).toBe(1);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
