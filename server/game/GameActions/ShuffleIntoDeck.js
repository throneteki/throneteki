import GameAction from './GameAction.js';
import Shuffle from './Shuffle.js';
import ReturnCardToDeck from './ReturnCardToDeck.js';

class ShuffleIntoDeck extends GameAction {
    constructor() {
        super('shuffleIntoDeck');
    }

    canChangeGameState({ cards }) {
        return cards.some((card) => ReturnCardToDeck.allow({ card }));
    }

    createEvent({ cards, allowSave = true }) {
        return this.event('onCardsShuffledIntoDeck', { cards }, (event) => {
            for (const card of event.cards) {
                event.thenAttachEvent(
                    ReturnCardToDeck.createEvent({ card, allowSave, orderable: false })
                );
            }
            event.thenAttachEvent(this.createShuffleSequenceEvent(event.cards));
        });
    }

    createShuffleSequenceEvent(cards) {
        const players = new Set(cards.map((card) => card.owner));
        const shuffleSequenceEvent = this.event('__SHUFFLE_SEQUENCE__');
        shuffleSequenceEvent.thenExecute(() => {
            for (const player of players) {
                shuffleSequenceEvent.thenAttachEvent(Shuffle.createEvent({ player }));
            }
        });
        return shuffleSequenceEvent;
    }
}

export default new ShuffleIntoDeck();
