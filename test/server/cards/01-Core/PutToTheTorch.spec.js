describe('Put to the Torch', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Put to the Torch'],
                inPlay: ['Ser Jaime Lannister (Core)'],
                gold: 1
            },
            player2: { inPlay: ['Sweet Cersei'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
        this.player1.triggerAbility(this.putToTheTorch);
        this.player1.clickCard(this.sweetCersei);
    });

    it('discards a location controlled by the losing opponent after you win a military challenge by 5 or more STR as the attacker', function () {
        expect(this.sweetCersei.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
