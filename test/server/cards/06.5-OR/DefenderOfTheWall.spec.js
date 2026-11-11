describe('Defender of the Wall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Defender of the Wall']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.defenderOfTheWall);
        this.player2.clickPrompt('Done');
    });

    it('gets +2 STR while defending', function () {
        expect(this.defenderOfTheWall.getStrength()).toBe(4);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
