import Event from '../../../server/game/event.js';
import GameAction from '../../../server/game/GameActions/GameAction.js';
import DiscardPower from '../../../server/game/GameActions/DiscardPower.js';
import DiscardTopCards from '../../../server/game/GameActions/DiscardTopCards.js';
import DrawCards from '../../../server/game/GameActions/DrawCards.js';
import GainGold from '../../../server/game/GameActions/GainGold.js';
import GainPower from '../../../server/game/GameActions/GainPower.js';
import MovePower from '../../../server/game/GameActions/MovePower.js';
import NullEvent from '../../../server/game/NullEvent.js';
import ReturnCardToHand from '../../../server/game/GameActions/ReturnCardToHand.js';
import ReturnGoldToTreasury from '../../../server/game/GameActions/ReturnGoldToTreasury.js';
import SimultaneousActions from '../../../server/game/GameActions/SimultaneousActions.js';
import { messageText } from '../../helpers/messageText.js';

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

            expect(messageText(GainGold.resultMessage({ amount: 5 }, event))).toBe('gains 2 gold');
        });
    });

    describe('gaining power', function () {
        it('reports the power actually gained', function () {
            const card = {
                name: 'Hedge Knight',
                getType: () => 'character',
                getPowerToGain: () => 0
            };
            const event = new Event('onCardPowerGained', { card, power: 1, reason: 'ability' });

            expect(messageText(GainPower.resultMessage({ card, amount: 3 }, event))).toBe(
                'gains 1 power on Hedge Knight'
            );
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

            expect(messageText(DrawCards.resultMessage({ amount: 3 }, event))).toBe('draws 1 card');
        });
    });

    describe('power and gold', function () {
        it('reports the power actually discarded and moved', function () {
            const card = { name: 'Hedge Knight' };
            const discarded = new Event('onCardPowerDiscarded', { card, power: 1 });
            const moved = new Event('onCardPowerMoved', { source: card, target: card, power: 2 });

            expect(messageText(DiscardPower.resultMessage({ card, amount: 3 }, discarded))).toBe(
                'discards 1 power from Hedge Knight'
            );
            expect(messageText(MovePower.resultMessage({}, moved))).toBe(
                'moves 2 power from Hedge Knight to Hedge Knight'
            );
        });

        it("names the player whose gold is returned when it isn't the ability's player", function () {
            const player = { name: 'player1' };
            const opponent = { name: 'player2' };
            const own = new Event('onGoldReturned', { player, amount: 1, desiredAmount: 2 });
            const other = new Event('onGoldReturned', {
                player: opponent,
                amount: 1,
                desiredAmount: 1
            });
            const props = { context: { player } };

            expect(messageText(ReturnGoldToTreasury.resultMessage(props, own))).toBe(
                'returns 1 gold to the treasury'
            );
            expect(messageText(ReturnGoldToTreasury.resultMessage(props, other))).toBe(
                "returns 1 of player2's gold to the treasury"
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

            expect(messageText(DiscardTopCards.resultMessage({ context: { player } }, event))).toBe(
                'discards the top 2 cards of their deck'
            );
        });
    });

    describe('returning a card to hand', function () {
        it('reports the location the card was returned from', function () {
            const player = {};
            const card = { name: 'Hedge Knight', controller: player, location: 'hand' };
            const event = new Event('onCardReturnedToHand', {
                allowSave: true,
                card,
                originalLocation: 'dead pile'
            });

            expect(
                messageText(ReturnCardToHand.resultMessage({ card, context: { player } }, event))
            ).toBe('returns Hedge Knight from their dead pile to their hand');
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
