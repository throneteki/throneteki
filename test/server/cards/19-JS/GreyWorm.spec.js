describe('Grey Worm (JS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['House Maester'],
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Grey Worm (JS)']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.greyWorm);
        this.player2.clickPrompt('Done');
    });

    it('does not kneel when defending against an opponent with more cards in hand', function () {
        expect(this.greyWorm.kneeled).toBe(false);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
