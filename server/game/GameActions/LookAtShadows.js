import GameAction from './GameAction.js';
import Message from '../Message.js';

class LookAtShadows extends GameAction {
    constructor() {
        super('lookAtShadows');
    }

    message({ opponent }) {
        return Message.fragment("looks at {opponent}'s shadows area", { opponent });
    }

    canChangeGameState({ opponent }) {
        return opponent && opponent.shadows.length > 0;
    }

    createEvent({ player, opponent, context }) {
        return this.event('onLookAtShadows', { player, opponent }, (event) => {
            context.game.promptForSelect(event.player, {
                activePromptTitle: `Look at ${event.opponent.name}'s shadow area`,
                source: context.source,
                revealTargets: true,
                cardCondition: (card) =>
                    card.location === 'shadows' && card.controller === event.opponent,
                onSelect: () => true
            });
        });
    }
}

export default new LookAtShadows();
