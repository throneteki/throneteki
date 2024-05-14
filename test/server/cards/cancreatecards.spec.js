import cards from '../../../server/game/cards/index.js';

describe('All Cards', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', [
            'on',
            'removeListener',
            'addPower',
            'addMessage',
            'addEffect'
        ]);
        this.playerSpy = jasmine.createSpyObj('player', ['registerAbilityMax']);
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
