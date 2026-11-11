describe('Cersei Lannister (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Cersei Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickPrompt('Done');
    });

    it('raises the claim on your revealed plot by 1 while she is attacking in an [intrigue] challenge', function () {
        expect(this.player1Object.getClaim()).toBe(2);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
