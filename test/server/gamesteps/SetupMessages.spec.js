describe('setup messages', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'stark', agenda: 'Fealty' },
            player2: { faction: 'lannister' }
        });
    });

    it('names each faction and agenda', function () {
        const log = this.game.getPlainTextLog();
        expect(log).toContain('player1 announces they are playing as House Stark with Fealty');
        expect(log).toContain(
            'player2 announces they are playing as House Lannister with no agenda'
        );
    });
});
