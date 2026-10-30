describe('Ser Daven Lannister (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Daven Lannister (TSoW)'],
                hand: ['The Roseroad'],
                drawDeck: ['Hedge Knight']
            },
            player2: { hand: ['Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serDavenLannister);
        this.player1.triggerAbility('Ser Daven Lannister');
        this.player2.clickCard(this.castleGuard);
    });

    it('has each opponent discard a card after it gains power, then draws if you have more cards in hand', function () {
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
