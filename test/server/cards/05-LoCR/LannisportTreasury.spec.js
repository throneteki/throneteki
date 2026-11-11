import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Lannisport Treasury', function () {
    it('moves 1 gold from your gold pool to itself after the taxation phase begins', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Lannisport Treasury'], gold: 2 }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Lannisport Treasury');
        expect(this.lannisportTreasury.tokens[Tokens.gold]).toBe(1);
    });

    it('kneels to move gold from itself to your gold pool', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: [{ card: 'Lannisport Treasury', tokens: { [Tokens.gold]: 3 } }] }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickMenu(this.lannisportTreasury, 'Move gold to gold pool');
        this.player1.clickPrompt('2');
        expect(this.lannisportTreasury.tokens[Tokens.gold]).toBe(1);
        expect(this.player1Object.gold).toBe(this.startingGold + 2);
    });
});
