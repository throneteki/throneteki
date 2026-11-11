import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Bronn (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Bronn (HMW)', tokens: { [Tokens.gold]: 2 } },
                    'Tyrion Lannister (Core)'
                ]
            },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
        this.player1.clickCard(this.tyrionLannister);
        this.player1.triggerAbility('Bronn');
    });

    it('discards each gold to save a Lord or Lady, then may return to hand if it saved Tyrion Lannister', function () {
        expect(this.bronn.getStrength()).toBe(this.bronn.getPrintedStrength());
        this.player1.clickPrompt('Yes');
        expect(this.tyrionLannister.location).toBe('play area');
        expect(this.bronn.location).toBe('hand');
    });
});
