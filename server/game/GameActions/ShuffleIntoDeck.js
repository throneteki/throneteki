const GameAction = require('./GameAction');
const Shuffle = require('./Shuffle');
const ReturnCardToDeck = require('./ReturnCardToDeck');

class ShuffleIntoDeck extends GameAction {
    constructor() {
        super('shuffleIntoDeck');
    }

    canChangeGameState({ cards }) {
        return cards.some(card => card.location !== 'draw deck');
    }

    createEvent({ cards, allowSave = true }) {
        return this.event('onCardsShuffledIntoDeck', { cards }, event => {
            const players = new Set();

            for(const card of event.cards) {
                event.thenAttachEvent(ReturnCardToDeck.createEvent({card, allowSave}));
                players.add(card.owner);
            }

            for(const player of players) {
                event.thenAttachEvent(Shuffle.createEvent({ player }));
            }
        });
    }
}

module.exports = new ShuffleIntoDeck();
