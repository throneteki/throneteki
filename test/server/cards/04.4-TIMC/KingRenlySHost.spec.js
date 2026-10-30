describe("King Renly's Host", function () {
    function setup(context, plot) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                plot,
                inPlay: ["King Renly's Host", 'Tumblestone Knight']
            }
        });
    }

    it('gets +4 STR while there is a Summer plot revealed', function () {
        setup(this, 'Sailing the Summer Sea');

        expect(this.kingRenlysHost.getStrength()).toBe(8);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot be declared as an attacker while there is a Winter plot revealed', function () {
        setup(this, 'Snowed Under');

        this.player1.clickPrompt('Power');

        expect(this.player1).not.toBeAbleToSelect(this.kingRenlysHost);

        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
