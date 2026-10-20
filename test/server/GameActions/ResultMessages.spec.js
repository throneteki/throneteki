import Event from '../../../server/game/event.js';
import GameAction from '../../../server/game/GameActions/GameAction.js';
import DiscardPower from '../../../server/game/GameActions/DiscardPower.js';
import DiscardTopCards from '../../../server/game/GameActions/DiscardTopCards.js';
import DrawCards from '../../../server/game/GameActions/DrawCards.js';
import GainGold from '../../../server/game/GameActions/GainGold.js';
import GainPower from '../../../server/game/GameActions/GainPower.js';
import Message from '../../../server/game/Message.js';
import MovePower from '../../../server/game/GameActions/MovePower.js';
import NullEvent from '../../../server/game/NullEvent.js';
import ReturnGoldToTreasury from '../../../server/game/GameActions/ReturnGoldToTreasury.js';
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

    describe('gaining power', function () {
        it('reports the power actually gained', function () {
            const card = { getType: () => 'character', getPowerToGain: () => 0 };
            const event = new Event('onCardPowerGained', { card, power: 1, reason: 'ability' });

            expect(
                Message.format('{0}', GainPower.resultMessage({ card, amount: 3 }, event))
            ).toEqual(['gains ', 1, ' power on ', card]);
        });
    });

    describe('drawing cards', function () {
        it('reports the number of cards actually drawn', function () {
            const event = new Event('onCardsDrawn', {
                amount: 1,
                cards: [],
                desiredAmount: 3,
                length: 1,
                player: {},
                reason: 'ability',
                source: {}
            });

            expect(Message.format('{0}', DrawCards.resultMessage({ amount: 3 }, event))).toEqual([
                'draws ',
                '1 card'
            ]);
        });
    });

    describe('power and gold', function () {
        it('reports the power actually discarded and moved', function () {
            const card = {};
            const discarded = new Event('onCardPowerDiscarded', { card, power: 1 });
            const moved = new Event('onCardPowerMoved', { source: card, target: card, power: 2 });

            expect(
                Message.format('{0}', DiscardPower.resultMessage({ card, amount: 3 }, discarded))
            ).toEqual(['discards ', '1 power', ' from ', card]);
            expect(Message.format('{0}', MovePower.resultMessage({}, moved))).toEqual([
                'moves ',
                2,
                ' power from ',
                card,
                ' to ',
                card
            ]);
        });

        it("names the player whose gold is returned when it isn't the ability's player", function () {
            const player = {};
            const opponent = {};
            const own = new Event('onGoldReturned', { player, amount: 1, desiredAmount: 2 });
            const other = new Event('onGoldReturned', {
                player: opponent,
                amount: 1,
                desiredAmount: 1
            });
            const props = { context: { player } };

            expect(Message.format('{0}', ReturnGoldToTreasury.resultMessage(props, own))).toEqual([
                'returns ',
                1,
                ' gold to the treasury'
            ]);
            expect(Message.format('{0}', ReturnGoldToTreasury.resultMessage(props, other))).toEqual(
                ['returns ', 1, ' of ', opponent, "'s gold to the treasury"]
            );
        });
    });

    describe('discarding the top cards of a deck', function () {
        it('reports the number of cards actually discarded', function () {
            const player = {};
            const event = new Event('onTopCardsDiscarded', {
                amount: 2,
                desiredAmount: 5,
                isPillage: false,
                player,
                source: {}
            });

            expect(
                Message.format('{0}', DiscardTopCards.resultMessage({ context: { player } }, event))
            ).toEqual(['discards the top ', '2 cards', ' of their deck']);
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
