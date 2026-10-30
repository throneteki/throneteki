describe('Shae', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'lannister', inPlay: ['Shae'], gold: 1 }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.shae);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.shae);
    });

    it('pays 1 gold to stand herself', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.shae.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
