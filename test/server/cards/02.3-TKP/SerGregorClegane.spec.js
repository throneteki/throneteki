describe('Ser Gregor Clegane (TKP)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Gregor Clegane (TKP)'] },
            player2: { drawDeck: ['Hedge Knight'], inPlay: ['Bastard in Hiding', 'Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serGregorClegane);
        this.player2.clickCard(this.castleGuard);
        this.player1.triggerAbility('Ser Gregor Clegane');
        this.player1.clickCard(this.bastardInHiding);
    });

    it('places a character discarded using pillage in the dead pile, then may kill a character with the same printed cost', function () {
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.bastardInHiding.location).toBe('dead pile');
    });
});
