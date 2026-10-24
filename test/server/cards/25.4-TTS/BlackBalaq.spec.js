describe('Black Balaq (TTS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Black Balaq (TTS)', gold: 1 }]
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.blackBalaq);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
    });

    it('gives each defending character -X STR while he attacks, where X is his gold', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(1);

        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.player1).isReadyToTakeAction();
    });
});
