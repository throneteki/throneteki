describe('Jade Sea Dromond', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Jade Sea Dromond'] },
            player2: { inPlay: ['Sweet Cersei'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.jadeSeaDromond);
        this.player1.clickCard(this.sweetCersei);
    });

    it('kneels and sacrifices itself to discard a non-limited location with printed cost 3 or lower during the dominance phase', function () {
        expect(this.jadeSeaDromond.location).toBe('discard pile');
        expect(this.sweetCersei.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
