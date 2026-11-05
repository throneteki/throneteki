describe('Walder Frey', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Walder Frey', 'Black Walder']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.walderFrey);
        this.player1.clickPrompt('Done');
    });

    it('makes each other House Frey character you control count as attacking while he attacks', function () {
        expect(this.blackWalder.isAttacking()).toBe(true);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
