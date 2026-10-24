describe('Clydas (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Clydas (R)'], gold: 0 },
            player2: { gold: 1 }
        });
        this.player1.clickCard(this.clydas);
        this.player1.clickCard(this.clydas);
    });

    it("kneels itself or a Raven to move 1 gold from an opponent's gold pool to yours", function () {
        expect(this.clydas.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(1);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
