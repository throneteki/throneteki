describe('House Manwoody Guard', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['House Manwoody Guard']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.houseManwoodyGuard);
        this.player2.clickPrompt('Done');
    });

    it('stops each Guard character you control kneeling as a defender while you are not the first player', function () {
        expect(this.houseManwoodyGuard.kneeled).toBe(false);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
