describe("Prince's Attendant", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ["Prince's Attendant"], hand: ['Edric Dayne (Core)'], gold: 0 }
        });
        this.player1.clickCard(this.princesAttendant);
    });

    it('kneels to reduce the cost of the next martell Lord or Lady you marshal this phase by 2', function () {
        this.player1.clickCard(this.edricDayne);

        expect(this.princesAttendant.kneeled).toBe(true);
        expect(this.edricDayne.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
