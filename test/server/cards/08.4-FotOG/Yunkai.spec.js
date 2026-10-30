import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Yunkai', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Yunkai', tokens: { [Tokens.gold]: 3 } },
                    'Robert Baratheon (Core)'
                ]
            },
            player2: { inPlay: ['Hedge Knight', 'Ranging Party'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.robertBaratheon);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.rangingParty);
        this.player2.clickPrompt('Done');
        this.player1.clickMenu(this.yunkai, 'Remove characters from challenge');
        this.player1.selectValue(2);
    });

    it('kneels and discards X gold to remove each character with STR X or lower from the challenge', function () {
        expect(this.yunkai.kneeled).toBe(true);
        expect(this.yunkai.tokens[Tokens.gold]).toBe(1);
        expect(this.hedgeKnight.isParticipating()).toBe(false);
        expect(this.rangingParty.isParticipating()).toBe(true);
    });

    it('places 2 gold on it if you then win the challenge', function () {
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        expect(this.yunkai.tokens[Tokens.gold]).toBe(3);
    });
});
