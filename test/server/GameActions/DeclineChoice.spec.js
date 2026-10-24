import DeclineChoice from '../../../server/game/GameActions/DeclineChoice.js';

describe('declining a choice', function () {
    it('is not a standalone ability effect', function () {
        expect(DeclineChoice.allow({ player: {} })).toBe(false);
    });

    it('can finish a choice or a continuation without changing card state', function () {
        const player = {};
        expect(DeclineChoice.allow({ choosingPlayer: player })).toBe(true);
        expect(DeclineChoice.allow({ parentContext: {} })).toBe(true);
        const event = DeclineChoice.createEvent({ choosingPlayer: player });
        expect(event.name).toBe('onChoiceDeclined');
        expect(event.player).toBe(player);
    });
});
