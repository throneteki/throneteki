import HandlerGameActionWrapper from '../../../server/game/GameActions/HandlerGameActionWrapper.js';
import BaseAbility from '../../../server/game/baseability.js';
import ChooseGameAction from '../../../server/game/GameActions/ChooseGameAction.js';

describe('explicit callback game actions', function () {
    it('requires a game-state predicate instead of accepting any handler', function () {
        expect(() => new HandlerGameActionWrapper({ handler: () => {} })).toThrow();
    });

    it('uses its predicate to determine whether it can resolve', function () {
        const predicate = vi.fn((context) => context.available);
        const action = new HandlerGameActionWrapper({
            handler: () => {},
            canChangeGameState: predicate
        });
        expect(action.allow({ available: false })).toBe(false);
        expect(action.allow({ available: true })).toBe(true);
        expect(predicate).toHaveBeenCalledTimes(2);
    });

    it('rejects legacy handlers on abilities and function choices', function () {
        expect(() => new BaseAbility({ handler: () => true })).toThrow('gameAction');
        const action = new ChooseGameAction({ choices: {} });
        expect(() => action.buildGameAction(() => true)).toThrow('gameAction');
    });
});
