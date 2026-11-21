describe('the game result in the game state', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal' });
        this.stateFor = (viewer) => this.game.getState(viewer.name);
    });

    it('has no result while the game is going on', function () {
        const state = this.stateFor(this.player1.player);

        expect(state.winners).toBeUndefined();
        expect(state.winReason).toBeUndefined();
        expect(state.players[this.player2.player.name].eliminatedReason).toBeUndefined();
        expect(state.players[this.player1.player.name].standing).toBeUndefined();
        expect(this.player1).isReadyToTakeAction();
    });

    it('names the winner, why they won, and where everyone placed once a player concedes', function () {
        this.game.concede(this.player2.player.name);

        for (const viewer of [this.player1.player, this.player2.player]) {
            const state = this.stateFor(viewer);
            expect(state.winners).toEqual([this.player1.player.name]);
            expect(state.winReason).toBe('concede');
            expect(state.players[this.player1.player.name].standing).toBe(1);
            expect(state.players[this.player2.player.name].standing).toBe(2);
            expect(state.players[this.player2.player.name].eliminated).toBe(true);
            expect(state.players[this.player2.player.name].eliminatedReason).toBe('concede');
            expect(state.players[this.player1.player.name].eliminatedReason).toBeUndefined();
        }
    });
});
