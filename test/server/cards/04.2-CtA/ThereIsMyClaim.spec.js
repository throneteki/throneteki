describe('There Is My Claim', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: [
                    'There Is My Claim',
                    'Left',
                    'Right',
                    'Maester Lomys',
                    'Margaery Tyrell (Core)'
                ],
                inPlay: ['Tumblestone Knight']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.thereIsMyClaim);
    });

    it('reveals 4 tyrell characters from your hand to raise your claim by 1 until the end of the challenge', function () {
        this.player1.clickCard(this.left);
        this.player1.clickCard(this.right);
        this.player1.clickCard(this.maesterLomys);
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.clickPrompt('Done');

        expect(this.player1Object.getClaim()).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
