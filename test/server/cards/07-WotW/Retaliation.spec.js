describe('Retaliation', function () {
    function setup(context, opponentPlot) {
        context.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Retaliation'] },
            player2: { plotDeck: [opponentPlot] }
        });

        context.player1.selectPlot(context.retaliation);
        context.player2.selectPlot(opponentPlot);
    }

    it('makes you choose an opponent to be first player when you win initiative', function () {
        setup(this, 'A Noble Cause');

        expect(this.player1).toHavePromptButton('player2');
        expect(this.player1).not.toHavePromptButton('player1');

        this.player1.clickPrompt('player2');

        expect(this.game.getFirstPlayer()).toBe(this.player2Object);
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not restrict an opponent who wins initiative', function () {
        setup(this, 'Sneak Attack');

        expect(this.player2).toHavePromptButton('player1');
        expect(this.player2).toHavePromptButton('player2');

        this.player2.clickPrompt('player2');

        expect(this.game.getFirstPlayer()).toBe(this.player2Object);
        expect(this.player2).isReadyToTakeAction();
    });
});
