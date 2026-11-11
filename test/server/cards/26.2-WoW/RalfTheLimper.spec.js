describe('Ralf the Limper (WoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ralf the Limper (WoW)'] },
            player2: { drawDeck: ['Sweet Cersei'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.ralfTheLimper);
        this.player1.triggerAbility(this.ralfTheLimper);
    });

    it("returns a card you control with shadow to shadows after a non-character card is discarded from an opponent's deck", function () {
        this.player1.clickCard(this.ralfTheLimper);

        expect(this.sweetCersei.location).toBe('discard pile');
        expect(this.ralfTheLimper.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
