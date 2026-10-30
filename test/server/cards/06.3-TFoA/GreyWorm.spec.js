describe('Grey Worm (TFoA)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'targaryen', inPlay: ['Grey Worm (TFoA)'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.greyWorm);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.greyWorm);
        this.player1.clickCard(this.serJaimeLannister);
    });

    it('gives a defending character -3 STR during a challenge in which he is attacking', function () {
        expect(this.serJaimeLannister.getStrength()).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
