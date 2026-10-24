import GameAction from './GameAction.js';
import Message from '../Message.js';
import PlaceCard from './PlaceCard.js';

class SwitchCards extends GameAction {
    constructor() {
        super('switch');
    }

    message({ cards }) {
        return Message.fragment('switches {first} with {second}', {
            first: cards[0],
            second: cards[1]
        });
    }

    canChangeGameState({ cards }) {
        if (!cards || cards.length !== 2 || !cards[0] || !cards[1] || cards[0] === cards[1]) {
            return false;
        }

        const [first, second] = cards.map((card) => this.positionOf(card));
        return first.location !== second.location || first.bottom !== second.bottom;
    }

    createEvent({ cards }) {
        return this.event('onCardsSwitched', { cards }, (event) => {
            const [first, second] = event.cards;
            const firstPosition = this.positionOf(first);
            const secondPosition = this.positionOf(second);

            event.thenAttachEvent(PlaceCard.createEvent({ card: first, ...secondPosition }));
            event.thenAttachEvent(PlaceCard.createEvent({ card: second, ...firstPosition }));
        });
    }

    positionOf(card) {
        const pile = card.owner.getSourceList(card.location);
        const bottom =
            card.location === 'draw deck' && pile.length > 1 && pile[pile.length - 1] === card;
        return { location: card.location, bottom };
    }
}

export default new SwitchCards();
