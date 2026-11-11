describe('Extortion', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Maester Luwin'], hand: ['Extortion'] }
        });
        this.startingGold = this.player1Object.gold;
        this.opponentGold = this.player2Object.gold;
        this.unopposedChallenge(this.player1, 'Intrigue', this.maesterLuwin);
        this.player1.triggerAbility('Extortion');
    });

    it("gains 3 gold and returns up to 3 gold from the loser's gold pool", function () {
        expect(this.player1Object.gold).toBe(this.startingGold + 3);
        expect(this.player2Object.gold).toBe(this.opponentGold - 3);
        expect(this.player1).isReadyToTakeAction();
    });
});
