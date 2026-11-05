import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Ser Guyard Morrigen', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Time of Plenty'],
                inPlay: ['Ser Guyard Morrigen', 'Hedge Knight']
            }
        });
        this.player1.selectPlot('Time of Plenty');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility('Ser Guyard Morrigen');
    });

    it('places 1 gold on a Knight after a Summer plot is revealed', function () {
        this.player1.clickPrompt('Knight');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.tokens[Tokens.gold]).toBe(1);
    });

    it('places 1 gold on each Rainbow Guard you control instead, giving them an intrigue icon', function () {
        this.player1.clickPrompt('Rainbow Guard');
        expect(this.serGuyardMorrigen.tokens[Tokens.gold]).toBe(1);
        expect(this.serGuyardMorrigen.hasIcon('intrigue')).toBe(true);
    });
});
