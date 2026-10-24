import { Tokens } from '../../../../server/game/Constants/index.js';

describe('The Boneway', function () {
    it('places a vengeance token after you lose a challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Boneway'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('The Boneway');
        expect(this.theBoneway.tokens[Tokens.vengeance]).toBe(1);
    });

    it('kneels and discards 6 vengeance tokens to gain 3 power for your faction', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'The Boneway', tokens: { [Tokens.vengeance]: 6 } }] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickMenu(this.theBoneway, 'Gain 3 power for your faction');
        expect(this.theBoneway.kneeled).toBe(true);
        expect(this.theBoneway.tokens[Tokens.vengeance]).toBeUndefined();
        expect(this.player1Object.faction.power).toBe(3);
    });
});
