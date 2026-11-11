describe('Protectors of the Realm (VDS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'Protectors of the Realm (VDS)', inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.protectorsOfTheRealm);
    });

    it('kneels your faction card to give a Knight or Army character renown until the end of the phase', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.tumblestoneKnight.hasKeyword('renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
