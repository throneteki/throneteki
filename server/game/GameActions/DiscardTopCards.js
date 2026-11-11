import GameAction from './GameAction.js';
import Message from '../Message.js';
import TextHelper from '../TextHelper.js';
import DiscardCard from './DiscardCard.js';

class DiscardTopCards extends GameAction {
    constructor() {
        super('discardTopCards');
    }

    message({ player, amount, context }) {
        return this.describe(player, Math.min(amount, player.drawDeck.length), context);
    }

    resultMessage(props, event) {
        return this.hasResult(event)
            ? this.describe(event.player, event.amount, props.context)
            : '';
    }

    describe(player, amount, context) {
        const cards = TextHelper.count(amount, 'card');
        return context && context.player === player
            ? Message.fragment('discards the top {cards} of their deck', { cards })
            : Message.fragment("discards the top {cards} of {player}'s deck", { cards, player });
    }

    canChangeGameState({ player, amount }) {
        return amount > 0 && player.drawDeck.length > 0;
    }

    createEvent({ player, amount, isPillage = false, source }) {
        const actualAmount = Math.min(amount, player.drawDeck.length);
        let params = {
            amount: actualAmount,
            desiredAmount: amount,
            isFullyResolved: (event) => event.amount === event.desiredAmount,
            player,
            isPillage,
            source
        };
        return this.event('onTopCardsDiscarded', params, (event) => {
            event.topCards = event.player.drawDeck.slice(0, event.amount);
            for (const card of event.topCards) {
                event.thenAttachEvent(
                    DiscardCard.createEvent({
                        card,
                        isPillage: event.isPillage,
                        source: event.source,
                        orderable: false
                    })
                );
            }
        });
    }
}

export default new DiscardTopCards();
