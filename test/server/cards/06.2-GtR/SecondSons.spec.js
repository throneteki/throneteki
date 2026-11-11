import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Second Sons', function () {
    it('discards 1 gold from itself when the challenges phase ends', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Second Sons', tokens: { [Tokens.gold]: 2 } }] }
        });
        this.completeChallengesPhase();
        this.player1.clickPrompt('Discard 1 gold');
        expect(this.secondSons.tokens[Tokens.gold]).toBe(1);
        expect(this.secondSons.location).toBe('play area');
    });

    it('is sacrificed when the challenges phase ends without gold', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Second Sons'] }
        });
        this.completeChallengesPhase();
        this.player1.clickPrompt('Sacrifice');
        expect(this.secondSons.location).toBe('discard pile');
    });
});
