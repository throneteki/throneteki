describe('Called Into Service', function () {
    function setup(context, topCard) {
        context.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Called Into Service'],
                drawDeck: [topCard]
            }
        });

        context.player1.selectPlot('Called Into Service');
        context.player2.selectPlot('Filler Plot');
        context.selectFirstPlayer(context.player1);
    }

    it('puts a revealed character into play', function () {
        setup(this, 'Tumblestone Knight');

        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('draws a revealed non-character card and gains 2 gold', function () {
        setup(this, 'Little Bird (Core)');

        expect(this.littleBird.location).toBe('hand');
        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
