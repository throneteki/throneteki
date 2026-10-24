describe('Summerhall (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Summerhall (FtR)', 'Tumblestone Knight'],
                hand: ['Bastard in Hiding']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('stops cards entering or leaving play during [power] challenges while it is standing', function () {
        expect(this.tumblestoneKnight.allowGameAction('kill')).toBe(false);
        expect(this.player1Object.canPutIntoPlay(this.bastardInHiding)).toBe(false);
        expect(this.player1Object.canRevealPlot?.() ?? true).toBeTruthy();

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
