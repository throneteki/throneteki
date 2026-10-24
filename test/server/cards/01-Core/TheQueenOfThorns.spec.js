describe('The Queen of Thorns (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                inPlay: ['The Queen of Thorns (Core)'],
                hand: ['Margaery Tyrell (Core)']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.theQueenOfThorns);
        this.player1.triggerAbility(this.theQueenOfThorns);
        this.player1.clickCard(this.margaeryTyrell);
    });

    it('puts a tyrell character with printed cost 6 or lower into play from your hand after you win an intrigue challenge she is participating in', function () {
        expect(this.margaeryTyrell.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
