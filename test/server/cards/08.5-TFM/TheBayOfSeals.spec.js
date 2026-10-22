describe('The Bay of Seals', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'thenightswatch', inPlay: ['The Bay of Seals'] },
            player2: { inPlay: [{ card: 'Tumblestone Knight', kneeling: true }] }
        });
        this.player1.clickCard(this.theBayOfSeals);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to stand a character owned by an opponent', function () {
        expect(this.theBayOfSeals.kneeled).toBe(true);
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
