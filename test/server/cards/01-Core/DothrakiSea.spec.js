describe('Dothraki Sea', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: ['Dothraki Sea', 'Tumblestone Knight'],
                hand: ['Khal Drogo (Core)']
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        this.player1.triggerAbility(this.dothrakiSea);
        this.player1.clickCard(this.khalDrogo);
    });

    it('sacrifices itself to put a Dothraki character into play from your hand after you win a power challenge, and returns it at the end of the phase', function () {
        expect(this.dothrakiSea.location).toBe('discard pile');
        expect(this.khalDrogo.location).toBe('play area');

        this.completeChallengesPhase();

        expect(this.khalDrogo.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
