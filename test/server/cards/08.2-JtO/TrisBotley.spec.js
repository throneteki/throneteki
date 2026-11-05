describe('Tris Botley', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Tris Botley'] },
            player2: { discard: ['Hedge Knight'] }
        });
        this.player1.clickMenu(this.trisBotley, 'Remove card from game');
        this.player1.clickCard(this.hedgeKnight);
    });

    it("removes a card in an opponent's discard pile from the game", function () {
        expect(this.hedgeKnight.location).toBe('out of game');
        expect(this.player1).isReadyToTakeAction();
    });
});
