describe('Kingswood', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Kingswood (CoW)'] },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
    });

    it('gives attacking characters -1 STR in power challenges you defend, and is sacrificed after you lose a power challenge', function () {
        expect(this.castleGuard.getStrength()).toBe(2);
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.kingswood.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
