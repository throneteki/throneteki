import ThenClauseAbility from '../../server/game/ThenClauseAbility.js';

describe('ThenClauseAbility', function () {
    it('refreshes the game state before its effect resolves, so it sees constant effects from the first part', function () {
        const order = [];
        const game = {
            refreshGameState: vi.fn(() => order.push('refresh')),
            resolveGameAction: vi.fn(() => order.push('effect'))
        };
        const ability = new ThenClauseAbility({ gameAction: { allow: () => true } });

        ability.executeHandler({ game });

        expect(order).toEqual(['refresh', 'effect']);
    });
});
