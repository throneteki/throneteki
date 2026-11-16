describe('changing board size settings during a game', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Winterfell Steward'] } });
        this.hudOf = (viewer) =>
            this.game.getState(viewer.name).players[this.player1.player.name].hud;
    });

    it('keeps the settings for the rest of the game, so a refreshed board shows them', function () {
        this.game.hudChange(this.player1.player.name, {
            cards: '1.25',
            interface: 'large',
            auto: false,
            animations: true
        });

        expect(this.hudOf(this.player1.player)).toEqual({
            cards: '1.25',
            interface: 'large',
            auto: false,
            animations: true
        });
        expect(this.player1).isReadyToTakeAction();
    });

    it('drops anything that is not a board size setting', function () {
        this.game.hudChange(this.player1.player.name, {
            cards: 'huge',
            interface: 12,
            auto: 'yes',
            extra: true
        });

        expect(this.hudOf(this.player1.player)).toBeUndefined();
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not change the settings of another player', function () {
        this.game.hudChange(this.player2.player.name, { cards: 'large' });

        expect(this.hudOf(this.player1.player)).toBeUndefined();
        expect(this.player1).isReadyToTakeAction();
    });
});
