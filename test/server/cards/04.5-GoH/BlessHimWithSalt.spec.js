describe('Bless Him With Salt', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Drowned Men'],
                hand: ['Bless Him With Salt'],
                drawDeck: ['Hedge Knight']
            }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.drownedMen);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.blessHimWithSalt);
        this.player1.clickCard(this.drownedMen);
    });

    it('gives a participating Drowned God character +3 STR, and draws 1 card if you win the challenge', function () {
        expect(this.drownedMen.getStrength()).toBe(this.drownedMen.getPrintedStrength() + 3);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
