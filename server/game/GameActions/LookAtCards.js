import GameAction from './GameAction.js';
import Message from '../Message.js';

class LookAtCards extends GameAction {
    constructor() {
        super('lookAtCards');
    }

    message({ cards }) {
        return Message.fragment('looks at {cards}', {
            cards: cards.length === 1 ? 'a card' : 'cards'
        });
    }

    canChangeGameState({ cards }) {
        return cards.length > 0;
    }

    createEvent({ player, cards, context }) {
        return this.event('onLookAtCards', { player, cards }, (event) => {
            context.game.promptForSelect(event.player, {
                activePromptTitle: 'Look at cards',
                source: context.source,
                revealTargets: true,
                cardCondition: (card) => event.cards.includes(card),
                onSelect: () => true
            });
        });
    }
}

export default new LookAtCards();
