describe('Knights of the Realm', function () {
    function setup(context, player1InPlay, player2InPlay) {
        context.setupTest({
            phase: 'plot',
            player1: {
                agenda: 'Knights of the Realm',
                inPlay: player1InPlay
            },
            player2: {
                inPlay: player2InPlay
            }
        });

        context.player1.selectPlot('Filler Plot');
        context.player2.selectPlot('Filler Plot');
        context.selectFirstPlayer(context.player1);
    }

    it('draws 1 more card in the draw phase while you control more Knights than each opponent', function () {
        setup(this, ['Tumblestone Knight'], []);

        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('draws 1 fewer card in the draw phase while you control fewer Knights than each opponent', function () {
        setup(this, [], ['Tumblestone Knight']);

        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
