const GameAction = require('./GameAction');
const Message = require('../Message');
const TextHelper = require('../TextHelper');

class DrawCards extends GameAction {
    constructor() {
        super('drawCards');
    }

    message({ player, amount }) {
        const actualAmount = player.getNumCardsToDraw(amount);
        return Message.fragment('draws {cards}', { cards: TextHelper.count(actualAmount, 'card') });
    }

    canChangeGameState({ player, amount }) {
        return amount > 0 && player.getNumCardsToDraw(amount) > 0;
    }

    createEvent({ player, amount, reason = 'ability', source }) {
        const actualAmount = player.getNumCardsToDraw(amount);
        const eventProps = {
            amount: actualAmount,
            cards: [],
            desiredAmount: amount,
            isFullyResolved: event => event.amount === event.desiredAmount,
            length: actualAmount, // Needed for legacy reason
            player,
            reason,
            source
        };
        return this.event('onCardsDrawn', eventProps, event => {
            let cards = player.drawDeck.slice(0, event.amount);
            for(const card of cards) {
                event.thenAttachEvent(
                    this.event('onCardDrawn', { card, player: event.player, reason, source }, () => {
                        player.placeCardInPile({ card, location: 'hand' });
                        player.drawnCards += 1;
                    })
                );
            }

            event.cards = cards;
        });
    }
}

module.exports = new DrawCards();
