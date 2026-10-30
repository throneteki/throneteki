describe('Northern Refugee', function () {
    function setup(context, opponentPlot) {
        context.setupTest({
            phase: 'marshal',
            player1: { gold: 2, hand: ['Northern Refugee'] },
            player2: { plot: opponentPlot }
        });
        context.player1.clickCard(context.northernRefugee);
    }

    it('costs 1 less to marshal while a Winter plot is revealed', function () {
        setup(this, 'The Winds of Winter');

        expect(this.northernRefugee.location).toBe('play area');
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('costs its printed cost while no Winter plot is revealed', function () {
        setup(this, 'A Noble Cause');

        expect(this.northernRefugee.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
