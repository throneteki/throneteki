describe('Hear Me Roar!', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'lannister',
                hand: ['Hear Me Roar!', 'Ser Jaime Lannister (Core)'],
                gold: 1
            }
        });
        this.player1.clickCard(this.hearMeRoar);
        this.player1.clickCard(this.serJaimeLannister);
    });

    it('puts a lannister character into play from your hand and discards it at the end of the phase', function () {
        expect(this.serJaimeLannister.location).toBe('play area');

        this.completeMarshalPhase();

        expect(this.serJaimeLannister.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
