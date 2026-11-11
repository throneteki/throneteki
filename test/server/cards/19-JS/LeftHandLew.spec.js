describe('Left Hand Lew', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'thenightswatch', inPlay: ['Left Hand Lew'] },
            player2: { inPlay: [{ card: 'Tumblestone Knight', kneeling: true }] }
        });
        this.player1.clickCard(this.leftHandLew);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to stand a character owned by an opponent', function () {
        expect(this.leftHandLew.kneeled).toBe(true);
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
