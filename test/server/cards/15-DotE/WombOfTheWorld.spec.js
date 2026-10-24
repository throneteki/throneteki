describe('Womb of the World (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Womb of the World (DotE)'],
                drawDeck: ['Devoted Bloodrider', 'Hedge Knight']
            }
        });
        this.player1.clickMenu(this.wombOfTheWorld, 'Reveal top 5 cards');
    });

    it('puts a revealed Dothraki character into play, and returns it to hand at the end of the phase', function () {
        expect(this.player1).not.toAllowSelect(this.hedgeKnight);
        this.player1.clickCard(this.devotedBloodrider);
        expect(this.devotedBloodrider.location).toBe('play area');
        this.completeChallengesPhase();
        expect(this.devotedBloodrider.location).toBe('hand');
    });

    it('may put none into play', function () {
        this.player1.clickPrompt('Done');
        expect(this.devotedBloodrider.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
