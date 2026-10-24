describe('The North Remembers', function () {
    it('has each player sacrifice a character or location', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], hand: ['The North Remembers'] },
            player2: { inPlay: ['The Roseroad'] }
        });
        this.player1.clickCard(this.theNorthRemembers);
        this.player1.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.theRoseroad);
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('discard pile');
    });

    it('pays 1 gold to return itself to your hand after a character you control is killed', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], discard: ['The North Remembers'] },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.triggerAbility('The North Remembers');
        expect(this.theNorthRemembers.location).toBe('hand');
    });
});
