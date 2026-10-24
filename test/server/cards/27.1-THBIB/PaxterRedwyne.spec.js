describe('Paxter Redwyne (THBIB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Paxter Redwyne (THBIB)', 'Sweet Cersei'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.paxterRedwyne);
        this.player1.triggerAbility(this.paxterRedwyne);
    });

    it('returns a location you own to your hand after a challenge he wins, or places it in shadows if it is a Warship', function () {
        this.player1.clickCard(this.sweetCersei);
        this.player1.clickPrompt('Put in shadows');

        expect(this.sweetCersei.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
