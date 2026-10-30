describe('Ser Imry Florent', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Ser Imry Florent', 'The Roseroad', 'The Kingsroad'] },
            player2: { inPlay: ['Hedge Knight', 'Castle Guard', 'Winterfell Steward'] }
        });
        this.player1.clickMenu(this.serImryFlorent, 'Force kneel');
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickCard(this.theKingsroad);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
    });

    it('kills itself to sacrifice locations, and has the opponent kneel a standing character for each', function () {
        expect(this.serImryFlorent.location).toBe('dead pile');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.theKingsroad.location).toBe('discard pile');
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.castleGuard.kneeled).toBe(true);
        expect(this.winterfellSteward.kneeled).toBe(false);
    });
});
