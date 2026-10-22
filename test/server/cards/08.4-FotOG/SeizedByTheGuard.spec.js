import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Seized by the Guard', function () {
    function setup(test, tokens) {
        test.setupTest({
            phase: 'plot',
            player1: {
                inPlay: [
                    {
                        card: 'Casterly Rock (Core)',
                        attachments: [{ card: 'Seized by the Guard', tokens }]
                    }
                ]
            }
        });
        [test.seized] = test.casterlyRock.attachments;
        test.player1.selectPlot('Filler Plot');
        test.player2.selectPlot('Filler Plot');
        test.selectFirstPlayer(test.player1);
    }

    it('discards 1 gold from itself when the marshaling phase begins', function () {
        setup(this, { [Tokens.gold]: 2 });
        this.player1.clickPrompt('Yes');
        expect(this.seized.tokens[Tokens.gold]).toBe(1);
        expect(this.seized.location).toBe('play area');
    });

    it('is sacrificed when the marshaling phase begins without gold', function () {
        setup(this, {});
        expect(this.seized.location).toBe('discard pile');
    });
});
