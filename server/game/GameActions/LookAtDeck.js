import GameAction from './GameAction.js';
import Message from '../Message.js';
import TextHelper from '../TextHelper.js';

class LookAtDeck extends GameAction {
    constructor() {
        super('lookAtHand');
    }

    message({ lookingAt, amount = 1, context }) {
        const cards = TextHelper.count(Math.min(amount, lookingAt.drawDeck.length), 'card');
        return context && context.player === lookingAt
            ? Message.fragment('looks at the top {cards} of their deck', { cards })
            : Message.fragment("looks at the top {cards} of {lookingAt}'s deck", {
                  cards,
                  lookingAt
              });
    }

    canChangeGameState({ lookingAt, amount = 1 }) {
        return lookingAt.drawDeck.length > 0 && amount > 0;
    }

    createEvent({ player, lookingAt, context, amount = 1 }) {
        const actualAmount = Math.min(amount, lookingAt.drawDeck.length);
        const isFullyResolved = (event) => event.amount === event.desiredAmount;
        return this.event(
            'onLookAtDeck',
            { player, lookingAt, amount: actualAmount, desiredAmount: amount, isFullyResolved },
            (event) => {
                event.topCards = event.lookingAt.drawDeck.slice(0, event.amount);
                context.game.promptForSelect(event.player, {
                    activePromptTitle: `Look at ${event.lookingAt.name}'s deck`,
                    source: context.source,
                    revealTargets: true,
                    cardCondition: (card) =>
                        card.location === 'draw deck' &&
                        card.controller === event.lookingAt &&
                        event.topCards.includes(card),
                    onSelect: () => true
                });
            }
        );
    }
}

export default new LookAtDeck();
