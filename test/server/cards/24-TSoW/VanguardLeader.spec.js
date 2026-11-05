describe('Vanguard Leader', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Vanguard Leader'],
                inPlay: ['Khal Drogo (Core)', 'Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.vanguardLeader);
    });

    it('can only be attached to a unique character, which gets +1 STR and the Commander trait', function () {
        expect(this.player1).toBeAbleToSelect(this.khalDrogo);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.khalDrogo);

        expect(this.khalDrogo.getStrength()).toBe(6);
        expect(this.khalDrogo.hasTrait('Commander')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
