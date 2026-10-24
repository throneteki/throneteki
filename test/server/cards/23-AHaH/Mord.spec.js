describe('Mord', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Mord'] },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickCard(this.mord);
    });

    it('kneels to blank a character controlled by a player with equal or higher initiative until he stands', function () {
        this.player1.clickCard(this.khalDrogo);

        expect(this.mord.kneeled).toBe(true);
        expect(this.khalDrogo.isBlankExcludingTraits()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
