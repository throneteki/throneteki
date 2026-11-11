describe('The Warrior (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'The Warrior (HMW)',
                inPlay: ['Septon Utt (HMW)']
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.septonUtt);
        this.player1.clickPrompt('Done');
    });

    it('raises its claim by 1 while you control an attacking The Seven character', function () {
        expect(this.player1Object.getClaim()).toBe(2);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
