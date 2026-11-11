import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Reznak mo Reznak', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Reznak mo Reznak', tokens: { [Tokens.gold]: 1 } }],
                hand: ['Hedge Knight']
            },
            player2: { inPlay: ['Courtesan of the Rose'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.courtesanOfTheRose);
        this.player1.triggerAbility('Reznak mo Reznak');
    });

    it('gains 1 gold after a character is discarded from your hand, then may discard X gold to put it into play', function () {
        expect(this.player1).toHavePrompt('Put Hedge Knight into play?');
        this.player1.clickPrompt('Yes');
        expect(this.reznakMoReznak.hasToken(Tokens.gold)).toBe(false);
        expect(this.hedgeKnight.location).toBe('play area');
    });

    it('keeps the gold if you do not put the character into play', function () {
        this.player1.clickPrompt('No');
        expect(this.reznakMoReznak.tokens[Tokens.gold]).toBe(2);
        expect(this.hedgeKnight.location).toBe('discard pile');
    });
});
