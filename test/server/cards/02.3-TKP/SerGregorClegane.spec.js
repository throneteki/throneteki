describe('Ser Gregor Clegane (TKP)', function () {
    function setup(test, drawDeck) {
        test.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Gregor Clegane (TKP)'] },
            player2: { drawDeck, inPlay: ['Bastard in Hiding', 'Castle Guard'] }
        });
        test.unopposedChallenge(test.player1, 'Military', test.serGregorClegane);
        test.player2.clickCard(test.castleGuard);
    }

    it('discards a non-character as normal', function () {
        setup(this, ['The Roseroad']);
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.player1).not.toAllowAbilityTrigger('Ser Gregor Clegane');
    });

    it('places a pillaged character in the dead pile, then may kill a character with the same printed cost', function () {
        setup(this, ['Hedge Knight']);
        this.player1.triggerAbility('Ser Gregor Clegane');
        expect(this.hedgeKnight.location).toBe('dead pile');
        this.player1.clickCard(this.bastardInHiding);
        expect(this.bastardInHiding.location).toBe('dead pile');
    });

    it('places a pillaged character in the dead pile without a kill prompt when no character has its printed cost', function () {
        setup(this, ['Maester Cressen (Core)']);
        this.player1.triggerAbility('Ser Gregor Clegane');
        expect(this.maesterCressen.location).toBe('dead pile');
        expect(this.player1).not.toHavePrompt('Select a character');
    });
});
