describe('challenge messages', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tumblestone Knight'] },
            player2: { inPlay: ['Bastard in Hiding'] }
        });
        this.player1.clickPrompt('Military');
    });

    it('does not log anything for a challenge cancelled by declaring no attackers', function () {
        const before = this.game.getPlainTextLog();
        this.player1.clickPrompt('Done');

        expect(this.game.getPlainTextLog()).toBe(before);
        expect(before).not.toContain('is initiating');
        expect(this.player1).toHavePromptButton('Military');
    });

    it('logs the challenge once attackers are declared', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.game.getPlainTextLog()).toContain(
            'player1 has initiated a military challenge against player2 with strength 2'
        );
        this.skipActionWindow();
        expect(this.player2).toHavePrompt('Select defenders');
    });
});
