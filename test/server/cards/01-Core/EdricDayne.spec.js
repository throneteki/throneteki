describe('Edric Dayne (Core)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Edric Dayne (Core)'], gold: 1 } });
        this.player1.clickCard(this.edricDayne);
        this.player1.clickPrompt('Military');
    });

    it('pays 1 gold to gain a challenge icon of your choice until the end of the phase', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.edricDayne.hasIcon('military')).toBe(true);
        expect(this.edricDayne.hasIcon('power')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
