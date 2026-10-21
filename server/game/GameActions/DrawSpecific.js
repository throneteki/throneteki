import GameAction from './GameAction.js';
import Message from '../Message.js';

class DrawSpecific extends GameAction {
    constructor() {
        super('drawSpecific');
    }

    message({ player, cards }) {
        const drawableCards = cards.filter((card) => card.location === 'draw deck');
        const actualDraw = drawableCards.slice(0, player.getNumCardsToDraw(drawableCards.length));
        return Message.fragment('draws {cards}', { cards: actualDraw });
    }

    resultMessage(props, event) {
        return this.hasResult(event)
            ? Message.fragment('draws {cards}', { cards: event.cards })
            : '';
    }

    canChangeGameState({ player, cards }) {
        const drawableCards = cards.filter((card) => card.location === 'draw deck');
        return player.getNumCardsToDraw(drawableCards.length) > 0;
    }

    createEvent({ player, cards, reason = 'ability', source }) {
        const drawableCards = cards.filter((card) => card.location === 'draw deck');
        const actualDraw = drawableCards.slice(0, player.getNumCardsToDraw(drawableCards.length));
        const eventProps = {
            amount: actualDraw.length,
            cards: actualDraw,
            desiredAmount: cards.length,
            isFullyResolved: (event) => event.amount === event.desiredAmount,
            length: actualDraw.length, // Needed for legacy reason
            player,
            reason,
            source
        };
        return this.event('onCardsDrawn', eventProps, (event) => {
            for (const card of event.cards) {
                event.thenAttachEvent(
                    this.event(
                        'onCardDrawn',
                        { card, player: event.player, reason, source },
                        () => {
                            player.placeCardInPile({ card, location: 'hand' });
                            player.drawnCards += 1;
                        }
                    )
                );
            }
        });
    }
}

export default new DrawSpecific();
