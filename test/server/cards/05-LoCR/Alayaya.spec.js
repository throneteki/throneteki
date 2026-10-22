describe('Alayaya', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Alayaya'], gold: 0 },
            player2: { gold: 1 }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.alayaya);
        this.player1.triggerAbility(this.alayaya);
    });

    it("moves 1 gold from the losing opponent's gold pool to yours after you win a challenge she participates in", function () {
        expect(this.player1Object.gold).toBe(1);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
