import Event from '../../../server/game/event.js';
import GameAction from '../../../server/game/GameActions/GameAction.js';
import GainGold from '../../../server/game/GameActions/GainGold.js';
import Message from '../../../server/game/Message.js';
import NullEvent from '../../../server/game/NullEvent.js';
import SimultaneousActions from '../../../server/game/GameActions/SimultaneousActions.js';

class NamedAction extends GameAction {
    constructor(name) {
        super(name);
    }

    message() {
        return this.name;
    }

    createEvent() {
        return new Event('onCardStood', { card: {} });
    }
}

describe('game action result messages', function () {
    describe('the default', function () {
        beforeEach(function () {
            this.action = new NamedAction('stands it');
        });

        it('is the action message when its event resolved', function () {
            expect(this.action.resultMessage({}, this.action.createEvent())).toBe('stands it');
        });

        it('is empty when its event was cancelled, or never created', function () {
            const cancelled = this.action.createEvent();
            cancelled.cancel();

            expect(this.action.resultMessage({}, cancelled)).toBe('');
            expect(this.action.resultMessage({}, new NullEvent())).toBe('');
            expect(this.action.resultMessage({}, undefined)).toBe('');
        });
    });

    describe('gaining gold', function () {
        it('reports the amount actually gained', function () {
            const event = new Event('onGoldGained', { amount: 2, desiredAmount: 5, player: {} });

            expect(Message.format('{0}', GainGold.resultMessage({ amount: 5 }, event))).toEqual([
                'gains ',
                2,
                ' gold'
            ]);
        });
    });

    describe('simultaneous actions', function () {
        it('only reports the actions whose events resolved', function () {
            const action = new SimultaneousActions([
                new NamedAction('stands A'),
                new NamedAction('stands B')
            ]);
            const event = action.createEvent({});
            event.childEvents[0].cancel();

            expect(action.resultMessage({}, event)).toEqual(['stands B']);
        });
    });
});
