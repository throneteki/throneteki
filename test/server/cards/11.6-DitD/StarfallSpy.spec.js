describe('Starfall Spy', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ['Starfall Spy'],
                shadows: ['Undercity Spymaster']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.starfallSpy);
        this.player1.triggerAbility(this.starfallSpy);
        this.player1.clickCard(this.undercitySpymaster);
    });

    it('returns itself to shadows to put another card you control in shadows into play after you win a challenge it is participating in', function () {
        expect(this.starfallSpy.location).toBe('shadows');
        expect(this.undercitySpymaster.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
