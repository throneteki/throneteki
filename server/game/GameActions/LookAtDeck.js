const GameAction = require('./GameAction');

class LookAtDeck extends GameAction {
    constructor() {
        super('lookAtHand');
    }

    canChangeGameState({ lookingAt, amount = 1 }) {
        return lookingAt.drawDeck.length > 0 && amount > 0;
    }

    createEvent({ player, lookingAt, context, amount = 1 }) {
        const actualAmount = Math.min(amount, lookingAt.drawDeck.length);
        return this.event('onLookAtDeck', { player, lookingAt, amount: actualAmount, desiredAmount: amount }, event => {
            let topCards = event.lookingAt.drawDeck.slice(0, amount);
            context.game.promptForSelect(event.player, {
                activePromptTitle: `Look at ${event.lookingAt.name}'s deck`,
                source: context.source,
                revealTargets: true,
                cardCondition: card => card.location === 'draw deck' && card.controller === event.lookingAt && topCards.includes(card),
                onSelect: () => true
            });
        });
    }
}

module.exports = new LookAtDeck();
