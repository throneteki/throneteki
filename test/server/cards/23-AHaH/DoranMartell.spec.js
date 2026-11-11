describe('Doran Martell (AHaH)', function () {
    it('gives each card you control in shadows shadow equal to its printed cost', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Doran Martell (AHaH)'], shadows: ['Hedge Knight'] }
        });
        expect(this.hedgeKnight.hasKeyword('Shadow (2)')).toBe(true);
    });

    it('places 1 of the top 2 cards of your deck in shadows and the other on the bottom after you lose dominance', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Doran Martell (AHaH)', kneeling: true }],
                drawDeck: ['Hedge Knight', 'Castle Guard']
            },
            player2: { inPlay: ['Ranging Party'] }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Doran Martell');
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Hedge Knight');
        expect(this.hedgeKnight.location).toBe('shadows');
        const deck = this.player1Object.drawDeck;
        expect(deck[deck.length - 1]).toBe(this.castleGuard);
    });
});
