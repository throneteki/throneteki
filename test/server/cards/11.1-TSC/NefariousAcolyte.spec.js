describe('Nefarious Acolyte', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Nefarious Acolyte'], gold: 1 } });
        this.player1.clickCard(this.nefariousAcolyte);
        this.player1.clickCard(this.player2Object.activePlot);
    });

    it('kneels and pays 1 gold to blank a plot card until the end of the phase', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.player2Object.activePlot.isBlankExcludingTraits()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
