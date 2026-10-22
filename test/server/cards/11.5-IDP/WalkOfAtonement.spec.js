describe('Walk of Atonement', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Hedge Knight', power: 2 }],
                hand: ['Walk of Atonement'],
                drawDeck: ['Castle Guard', 'Ranging Party']
            },
            player2: { hand: ['Tumblestone Knight', 'Winterfell Steward'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.walkOfAtonement);
        this.player1.selectValue('2');
        this.player1.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
    });

    it('discards a card at random from each opponent and draws a card for each power discarded', function () {
        expect(this.hedgeKnight.power).toBe(0);
        expect(this.player2Object.hand.length).toBe(0);
        expect(this.castleGuard.location).toBe('hand');
        expect(this.rangingParty.location).toBe('hand');
    });
});
