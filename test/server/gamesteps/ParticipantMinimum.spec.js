describe('a minimum number of defenders', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Besieged',
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
    });

    it('is enforced rather than reported', function () {
        expect(this.game.getPlainTextLog()).toContain('player2 must declare at least 1 defender');
        expect(this.game.getPlainTextLog()).not.toContain('player2 does not defend the challenge');
        expect(this.player2).toHavePrompt('Select defenders (min 1)');
        expect(this.player2).toBeAbleToSelect(this.bastardInHiding);
    });
});
