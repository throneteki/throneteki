describe('Jalabhar Xho', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Jalabhar Xho'] },
            player2: { power: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.jalabharXho);
    });

    it('lets any player discard 1 power from their faction card to take control of him', function () {
        expect(this.jalabharXho.controller).toBe(this.player2Object);
        expect(this.player2Object.faction.power).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
