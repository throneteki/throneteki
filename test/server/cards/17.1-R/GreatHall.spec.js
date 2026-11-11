describe('Great Hall (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Great Hall (R)'], hand: ['Khal Drogo (Core)'], gold: 4 }
        });
        this.player1.clickCard(this.greatHall);
    });

    it('kneels to reduce the cost of the next unique character you marshal this phase by 2 when its printed cost is 6 or higher', function () {
        this.player1.clickCard(this.khalDrogo);

        expect(this.greatHall.kneeled).toBe(true);
        expect(this.khalDrogo.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
