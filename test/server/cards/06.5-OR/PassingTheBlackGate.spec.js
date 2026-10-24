describe('Passing the Black Gate', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Passing the Black Gate', 'Tumblestone Knight'], gold: 1 }
        });
        this.player1.clickCard(this.passingTheBlackGate);
    });

    it('kneels your faction card to reduce the cost of each stark character you marshal this phase by 1', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
