describe('Polliver', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Polliver'] },
            player2: { drawDeck: ['Hedge Knight'] }
        });
        this.startingGold = this.player2Object.gold;
        this.unopposedChallenge(this.player1, 'Intrigue', this.polliver);
        this.player1.triggerAbility('Polliver');
    });

    it('returns 2 gold from the losing opponent to the treasury after pillaging a character', function () {
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.player2Object.gold).toBe(this.startingGold - 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
