import GameAction from './GameAction.js';

class LookAtHand extends GameAction {
    constructor() {
        super('lookAtHand');
    }

    canChangeGameState({ opponent }) {
        return opponent && opponent.hand.length > 0;
    }

    createEvent({ player, opponent, context }) {
        return this.event('onLookAtHand', { player, opponent }, (event) => {
            context.game.promptForSelect(event.player, {
                activePromptTitle: `Look at ${event.opponent.name}'s hand`,
                source: context.source,
                revealTargets: true,
                cardCondition: (card) =>
                    card.location === 'hand' && card.controller === event.opponent,
                onSelect: () => true
            });
        });
    }
}

export default new LookAtHand();
