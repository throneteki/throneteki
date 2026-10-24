describe('The Queen of Thorns (TMoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                inPlay: ['The Queen of Thorns (TMoW)'],
                shadows: ['Undercity Spymaster']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.theQueenOfThorns);
        this.player1.triggerAbility(this.theQueenOfThorns);
        this.player1.clickCard(this.undercitySpymaster);
    });

    it('puts a card you control in shadows into play after you win a challenge she is participating in', function () {
        expect(this.undercitySpymaster.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
