const _ = require('underscore');
const BaseCardSelector = require('./BaseCardSelector.js');

class EachPlayerCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);
        this.numCardsPerPlayer = properties.numCards;
    }

    canTarget(card, context, selectedCards) {
        return super.canTarget(card, context, selectedCards) && !this.isPlayerSatisfied(card, selectedCards);
    }

    isPlayerSatisfied(card, selectedCards) {
        let count = selectedCards ? selectedCards.filter(selectedCard => selectedCard.controller === card.controller).length : 0;
        return count >= this.numCardsPerPlayer;
    }

    defaultActivePromptTitle() {
        return this.numCardsPerPlayer === 1 ? 'Select a character controlled by each player' :
            `Select ${this.numCardsPerPlayer} characters controlled by each player`;
    }

    hasEnoughSelected(selectedCards, numPlayers) {
        return selectedCards.length === (numPlayers * this.numCardsPerPlayer);
    }

    hasEnoughTargets(context) {
        return _.every(context.game.getPlayers(), player => {
            let playerCards = Object.values(context.game.allCards).filter(card => card.controller === player);
            let matchingCards = playerCards.filter(card => super.canTarget(card, context));
            return matchingCards.length >= this.numCardsPerPlayer;
        });
    }

    hasReachedLimit(selectedCards, numPlayers) {
        return selectedCards.length >= (numPlayers * this.numCardsPerPlayer);
    }
}

module.exports = EachPlayerCardSelector;
