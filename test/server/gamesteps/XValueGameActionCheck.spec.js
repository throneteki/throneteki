describe('an ability whose game action uses an X chosen while paying', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], hand: ['Loot'] },
            player2: { drawDeck: Array(3).fill('Castle Guard'), gold: 3 }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
    });

    it('is offered before X has been chosen', function () {
        expect(this.player1).toAllowAbilityTrigger('Loot');
    });
});
