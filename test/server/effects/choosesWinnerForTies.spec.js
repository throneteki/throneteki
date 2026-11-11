import Effects from '../../../server/game/effects.js';

describe('Effects.choosesWinnerForTies', function () {
    it('keeps a controller eligible while any of their sources remain active', function () {
        const game = { tieWinnerChooserChanged: vi.fn() };
        const player = {
            choosesWinnerForInitiativeTiesSources: new Set(),
            choosesWinnerForDominanceTiesSources: new Set()
        };
        const firstSource = {};
        const secondSource = {};
        const context = { game, effect: firstSource };
        const effect = Effects.choosesWinnerForInitiativeTies();

        effect.apply(player, context);
        context.effect = secondSource;
        effect.apply(player, context);
        context.effect = firstSource;
        effect.unapply(player, context);

        expect(player.choosesWinnerForInitiativeTies).toBe(true);
        expect(player.choosesWinnerForInitiativeTiesSources).toEqual(new Set([secondSource]));

        context.effect = secondSource;
        effect.unapply(player, context);
        expect(player.choosesWinnerForInitiativeTies).toBe(false);
        expect(game.tieWinnerChooserChanged).toHaveBeenCalledTimes(4);
    });
});
