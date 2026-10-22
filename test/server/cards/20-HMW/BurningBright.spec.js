describe('Burning Bright (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'lannister',
                hand: ['Burning Bright (HMW)'],
                discard: ['Tumblestone Knight'],
                gold: 2
            }
        });
        this.player1.clickCard(this.burningBright);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('puts an Army or Knight character into play from your discard pile, and discards it at the end of the phase', function () {
        expect(this.tumblestoneKnight.location).toBe('play area');

        this.completeMarshalPhase();

        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
