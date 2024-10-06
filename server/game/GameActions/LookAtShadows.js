import GameAction from './GameAction.js';

class LookAtShadows extends GameAction {
    constructor() {
        super('lookAtShadows');
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
