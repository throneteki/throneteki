import Effects from '../../../server/game/effects.js';

describe('Effects.modifyUsedPlots', function () {
    it('adds and removes a fixed used plot modifier', function () {
        const player = { modifyUsedPlots: vi.fn() };
        const effect = Effects.modifyUsedPlots(-1);

        effect.apply(player);
        effect.unapply(player);

        expect(player.modifyUsedPlots).toHaveBeenNthCalledWith(1, -1);
        expect(player.modifyUsedPlots).toHaveBeenNthCalledWith(2, 1);
    });
});
