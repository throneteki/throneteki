import { Tokens } from '../../../../server/game/Constants/index.js';

describe('The House of Black and White', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'The House of Black and White', tokens: { [Tokens.gold]: 3 } }],
                gold: 2
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickMenu(this.theHouseOfBlackAndWhite, 'Kill character');
        this.player1.selectValue(2);
        this.player1.clickCard(this.hedgeKnight);
    });

    it('kneels and discards X gold to kill a character with printed STR X or lower, then may move gold to it', function () {
        this.player1.clickPrompt('1');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.theHouseOfBlackAndWhite.tokens[Tokens.gold]).toBe(2);
        expect(this.player1Object.gold).toBe(1);
    });
});
