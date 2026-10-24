describe('Nymeria Sand (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Nymeria Sand (SoD)'], drawDeck: ['Hedge Knight'] },
            player2: { inPlay: ['The Red Viper (Core)'], hand: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility('Nymeria Sand');
    });

    it("discards 1 card at random from the winner's hand and draws 1 card after you lose dominance", function () {
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
