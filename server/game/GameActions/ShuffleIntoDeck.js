const GameAction = require('./GameAction');
const Shuffle = require('./Shuffle');
const ReturnCardToDeck = require('./ReturnCardToDeck');
const SimultaneousEvents = require('../SimultaneousEvents');

class ShuffleIntoDeck extends GameAction {
    constructor() {
        super('shuffleIntoDeck');
    }

    canChangeGameState({ cards }) {
        return cards.some(card => card.location !== 'draw deck');
    }

    createEvent({ cards, allowSave = true }) {
        return this.event('onCardsShuffledIntoDeck', { cards }, event => {
            const returnEvents = new SimultaneousEvents();
            for(const card of event.cards) {
                returnEvents.addChildEvent(ReturnCardToDeck.createEvent({card, allowSave}));
            }
            returnEvents.addChildEvent(this.createShuffleSequenceEvent(event.cards));

            event.thenAttachEvent(returnEvents);
        });
    }

    createShuffleSequenceEvent(cards) {
        const players = new Set(cards.map(card => card.owner));
        const shuffleSequenceEvent = this.event('__SHUFFLE_SEQUENCE__');
        shuffleSequenceEvent.thenExecute(() => {
            for(const player of players) {
                shuffleSequenceEvent.thenAttachEvent(Shuffle.createEvent({ player }));
            }
        });
        return shuffleSequenceEvent;
    }
}

module.exports = new ShuffleIntoDeck();
