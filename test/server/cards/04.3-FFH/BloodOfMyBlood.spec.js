describe('Blood of My Blood', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Blood of My Blood'], drawDeck: ['Devoted Bloodrider'], gold: 5 }
        });
        this.player1.clickCard(this.bloodOfMyBlood);
        this.player1.clickCard(this.devotedBloodrider);
    });

    it('puts a Bloodrider from your deck into play, and returns it to your hand at the end of the phase', function () {
        expect(this.devotedBloodrider.location).toBe('play area');
        this.completeChallengesPhase();
        expect(this.devotedBloodrider.location).toBe('hand');
    });
});
