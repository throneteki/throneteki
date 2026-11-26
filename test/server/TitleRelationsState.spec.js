describe('titles in the game state', function () {
    beforeEach(function () {
        this.setupTest({ gameFormat: 'melee', phase: 'plot' });
        for (const player of [this.player1, this.player2, this.player3]) {
            player.selectPlot('Filler Plot');
        }
        this.selectFirstPlayer(this.player1);
        this.player1.selectTitle('Hand of the King');
        this.player2.selectTitle('Master of Coin');
        this.player3.selectTitle('Crown Regent');
    });

    it('names the titles each title rivals and supports', function () {
        const players = this.game.getState(this.player2.player.name).players;

        expect(players[this.player1.player.name].title.rivals).toEqual([
            'Master of Coin',
            'Master of Ships'
        ]);
        expect(players[this.player1.player.name].title.supports).toEqual(['Master of Laws']);
        expect(players[this.player2.player.name].title.supports).toEqual(['Master of Ships']);
        expect(players[this.player3.player.name].title.rivals).toEqual([]);
        expect(players[this.player3.player.name].title.supports).toEqual([]);
        expect(this.player1).isReadyToTakeAction();
    });
});
