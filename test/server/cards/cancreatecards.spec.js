import cards from '../../../server/game/cards/index.js';

describe('All Cards', function () {
    beforeEach(function () {
        this.gameSpy = {
            on: vi.fn(),
            removeListener: vi.fn(),
            addPower: vi.fn(),
            addMessage: vi.fn(),
            addEffect: vi.fn()
        };
        this.playerSpy = { registerAbilityMax: vi.fn() };
        this.playerSpy.game = this.gameSpy;
    });

    for (let cardClass of Object.values(cards)) {
        it("should be able to create '" + cardClass.name + "' and set it up", function () {
            // No explicit assertion - if this throws an exception it will fail
            // and give us a better stacktrace than the expect().not.toThrow()
            // assertion.
            new cardClass(this.playerSpy, {});
        });
    }
});
