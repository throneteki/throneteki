describe('Anders Yronwood (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player2: {
                inPlay: ['Anders Yronwood (HMW)']
            }
        });

        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.andersYronwood);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('stops each House Yronwood character kneeling when attacking in your first challenge while you are not the first player', function () {
        expect(this.andersYronwood.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
