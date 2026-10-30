describe('Freedmen', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'targaryen', inPlay: ['Khal Drogo (Core)'], discard: ['Freedmen'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.khalDrogo);
        this.player1.triggerAbility(this.freedmen);
    });

    it('puts itself into play from your discard pile after you win a challenge by 5 or more STR as the attacker', function () {
        expect(this.freedmen.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
