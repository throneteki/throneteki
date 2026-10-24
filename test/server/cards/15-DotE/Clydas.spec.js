describe('Clydas (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Clydas (DotE)'], gold: 0 },
            player2: { gold: 1 }
        });
        this.player1.clickCard(this.clydas);
    });

    it("moves 1 gold from an opponent's gold pool to yours", function () {
        expect(this.player1Object.gold).toBe(1);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
