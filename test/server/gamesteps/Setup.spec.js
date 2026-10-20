describe('setup', function () {
    integration(function () {
        beforeEach(function () {
            const stark = this.buildDeck('stark', ['A Noble Cause', 'Hedge Knight']);
            const baratheon = this.buildDeck('baratheon', ['A Noble Cause', 'Hedge Knight']);
            this.player1.selectDeck(stark);
            this.player2.selectDeck(baratheon);
            this.startGame();
        });

        it('chooses the first player, then announces factions in that order', function () {
            const log = this.game.getPlainTextLog();
            const firstPlayerAt = log.indexOf('randomly selected to be first player');
            const announcedAt = log.indexOf('announces they are playing');

            expect(firstPlayerAt).toBeGreaterThan(-1);
            expect(announcedAt).toBeGreaterThan(firstPlayerAt);

            const firstPlayer = log.match(/(\w+) has been randomly selected to be first player/)[1];
            const firstAnnouncement = log.match(/(\w+) announces they are playing as/)[1];
            expect(firstAnnouncement).toBe(firstPlayer);
            expect(this.player1).toHavePrompt('Keep Starting Hand?');
        });
    });
});
