import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Seized by the Guard', function () {
    function setup(tokens) {
        this.setupTest({
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
        [this.seized] = this.casterlyRock.attachments;
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    }

    it('discards 1 gold from itself when the marshaling phase begins', function () {
        setup.call(this, { [Tokens.gold]: 2 });
        this.player1.clickPrompt('Yes');
        expect(this.seized.tokens[Tokens.gold]).toBe(1);
        expect(this.seized.location).toBe('play area');
    });

    it('is sacrificed when the marshaling phase begins without gold', function () {
        setup.call(this, {});
        expect(this.seized.location).toBe('discard pile');
    });
});
