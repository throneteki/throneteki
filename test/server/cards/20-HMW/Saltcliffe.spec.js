import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Saltcliffe', function () {
    it('kneels to move 1 gold from the treasury to a Raider character without gold', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Saltcliffe (HMW)', 'Raider from Pyke (CoW)'] }
        });
        this.player1.clickMenu(this.saltcliffe, 'Move gold');
        this.player1.clickCard(this.raiderFromPyke);
        expect(this.saltcliffe.kneeled).toBe(true);
        expect(this.raiderFromPyke.tokens[Tokens.gold]).toBe(1);
    });

    it('can move it from a card in play instead', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    'Saltcliffe (HMW)',
                    'Raider from Pyke (CoW)',
                    { card: 'Coastal Reaver', tokens: { [Tokens.gold]: 2 } }
                ]
            }
        });
        this.player1.clickMenu(this.saltcliffe, 'Move gold');
        this.player1.clickCard(this.raiderFromPyke);
        this.player1.clickPrompt('Card');
        this.player1.clickCard(this.coastalReaver);
        expect(this.raiderFromPyke.tokens[Tokens.gold]).toBe(1);
        expect(this.coastalReaver.tokens[Tokens.gold]).toBe(1);
    });
});
