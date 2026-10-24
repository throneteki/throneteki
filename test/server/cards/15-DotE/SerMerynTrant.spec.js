describe('Ser Meryn Trant (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Meryn Trant (DotE)', 'Maester Luwin'] },
            player2: { hand: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.maesterLuwin);
        this.player1.triggerAbility('Ser Meryn Trant');
    });

    it("removes a card discarded from an opponent's hand from the game instead", function () {
        expect(this.hedgeKnight.location).toBe('out of game');
        expect(this.player1).isReadyToTakeAction();
    });
});
