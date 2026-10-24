describe('Raiding Khalasar', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Raiding Khalasar', 'Devoted Bloodrider']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.raidingKhalasar);
        this.player1.clickCard(this.devotedBloodrider);
        this.player1.clickPrompt('Done');
    });

    it('raises the claim on your revealed plot by 1 while it attacks with a Bloodrider character', function () {
        expect(this.player1Object.getClaim()).toBe(2);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
