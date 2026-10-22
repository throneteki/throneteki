describe('Fury of the Khalasar', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                plot: 'Fury of the Khalasar',
                hand: ['Khal Drogo (Core)']
            }
        });
        this.completeMarshalPhase();
        this.player1.triggerAbility(this.furyOfTheKhalasar);
        this.player1.clickCard(this.khalDrogo);
    });

    it('puts a Dothraki character into play from your hand after the challenges phase begins, and returns it at the end of the phase', function () {
        expect(this.khalDrogo.location).toBe('play area');

        this.completeChallengesPhase();

        expect(this.khalDrogo.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
