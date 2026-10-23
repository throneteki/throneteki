describe('Our Word Is Good as Gold (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Our Word Is Good as Gold (HMW)'],
                drawDeck: ['Devout Freerider'],
                gold: 5
            }
        });
        this.player1.clickCard(this.ourWordIsGoodAsGold);
        this.player1.clickCard(this.devoutFreerider);
    });

    it('puts a Mercenary from the top 10 cards of your deck into play, and returns it to your hand at the end of the phase', function () {
        expect(this.devoutFreerider.location).toBe('play area');
        this.completeChallengesPhase();
        expect(this.devoutFreerider.location).toBe('hand');
    });
});
