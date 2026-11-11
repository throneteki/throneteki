import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Planky Town Trader', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Planky Town Trader', tokens: { [Tokens.gold]: 2 } }],
                hand: ['Hedge Knight']
            },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
        this.player1.clickCard(this.plankyTownTrader);
        this.player1.triggerAbility('Planky Town Trader');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('puts a non-martell character with printed cost X or lower into play from your hand when it leaves play', function () {
        expect(this.plankyTownTrader.location).toBe('dead pile');
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.hedgeKnight.allowGameAction('kill')).toBe(false);
    });
});
