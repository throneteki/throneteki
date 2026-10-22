import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Fickle Bannerman', function () {
    function setup(test, tokens) {
        test.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Fickle Bannerman', tokens }] },
            player2: { inPlay: ['Robb Stark (Core)'] }
        });
        test.player1.clickPrompt('Done');
        test.unopposedChallenge(test.player2, 'Power', test.robbStark);
    }

    it('discards a gold from itself to stay under your control', function () {
        setup(this, { [Tokens.gold]: 1 });
        this.player1.clickPrompt('Yes');
        expect(this.fickleBannerman.controller).toBe(this.player1Object);
        expect(this.fickleBannerman.tokens[Tokens.gold]).toBeUndefined();
    });

    it('has the winning opponent take control of it otherwise', function () {
        setup(this, {});
        expect(this.fickleBannerman.controller).toBe(this.player2Object);
    });
});
