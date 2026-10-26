describe('Fair Isle', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Fair Isle'] },
            player2: { hand: ['Hedge Knight', 'Castle Guard', 'The Roseroad'] }
        });
        this.player1.clickMenu(this.fairIsle, 'Place cards on top of deck');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Done');
    });

    it('kneels to have an opponent place 2 cards from their hand on top of their deck, then draw 2 at the end of the phase', function () {
        expect(this.fairIsle.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.castleGuard.location).toBe('draw deck');
        this.completeChallengesPhase();
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('hand');
    });
});

describe('Fair Isle with The High Sparrow', function () {
    it('reports the number of cards actually drawn', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Fair Isle', 'The High Sparrow'] },
            player2: { hand: ['Hedge Knight', 'Tumblestone Knight'] }
        });
        this.player1.clickCard(this.fairIsle);
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.player2Object.hand.length).toBe(1);
        expect(this.game.getPlainTextLog()).toContain('Then player2 draws 1 card for Fair Isle');
    });
});
