describe('Grey Ghost', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Grey Ghost', 'Hedge Knight'] },
            player2: { inPlay: ['Castle Guard', 'Winterfell Steward'] }
        });
        this.player1.clickMenu(this.greyGhost, 'Prevent character(s) from defending');
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('kneels to make a character unable to be declared as a defender until the end of the phase', function () {
        expect(this.greyGhost.kneeled).toBe(true);
        expect(this.player2).not.toAllowSelect(this.castleGuard);
    });
});
