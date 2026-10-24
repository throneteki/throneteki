import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Power Behind the Throne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Power Behind the Throne'],
                inPlay: [{ card: 'Hedge Knight', kneeling: true }]
            }
        });
        this.player1.selectPlot('Power Behind the Throne');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.plot = this.player1Object.activePlot;
    });

    it('places a stand token when revealed', function () {
        expect(this.plot.tokens[Tokens.stand]).toBe(1);
    });

    it('discards a stand token to stand a character', function () {
        this.player1.clickMenu(this.plot, 'Discard a stand token');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.plot.tokens[Tokens.stand]).toBeUndefined();
        expect(this.player1).isReadyToTakeAction();
    });
});
