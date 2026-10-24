describe('Unsullied', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Unsullied']
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.unsullied);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
    });

    it('gives each defending character -1 STR while it is attacking', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(1);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
