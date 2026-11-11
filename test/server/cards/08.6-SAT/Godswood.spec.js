describe('Godswood', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Famine',
                inPlay: ['Godswood', 'Hedge Knight'],
                drawDeck: ['Castle Guard', 'Ranging Party']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Godswood');
    });

    it('kneels to draw cards equal to your claim with more Winter than Summer plots revealed', function () {
        expect(this.godswood.kneeled).toBe(true);
        expect(this.castleGuard.location).toBe('hand');
        expect(this.rangingParty.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
