const BaseCardSelector = require('./BaseCardSelector.js');

class EachPlayerCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);
        this.numCardsPerPlayer = properties.numCards;
    }

    canTarget(card, context, selectedCards) {
        return (
            super.canTarget(card, context, selectedCards || []) &&
            !this.isPlayerSatisfied(card, selectedCards || [])
        );
    }

    isPlayerSatisfied(card, selectedCards) {
        let count = selectedCards.filter(
            (selectedCard) => selectedCard.controller === card.controller
        ).length;
        return count >= this.numCardsPerPlayer;
    }

    defaultActivePromptTitle() {
        return this.numCardsPerPlayer === 1
            ? 'Select a character controlled by each player'
            : `Select ${this.numCardsPerPlayer} characters controlled by each player`;
    }

    hasEnoughSelected(selectedCards, numPlayers, context) {
        return (
            (selectedCards.length === 0 && this.optional) ||
            selectedCards.length === numPlayers * this.numCardsPerPlayer ||
            (this.ifAble && selectedCards.length === this.getMaximumSelectable(context))
        );
    }

    getMaximumSelectable(context) {
        return context.game.getPlayers().reduce((numSelectable, player) => {
            return (
                numSelectable +
                Math.min(
                    this.getMatchingCardsForPlayer(context, player).length,
                    this.numCardsPerPlayer
                )
            );
        }, 0);
    }

    hasEnoughTargets(context) {
        return (
            this.optional ||
            this.ifAble ||
            context.game.getPlayers().every((player) => {
                return (
                    this.getMatchingCardsForPlayer(context, player).length >= this.numCardsPerPlayer
                );
            })
        );
    }

    getMatchingCardsForPlayer(context, player) {
        let playerCards = context.game.allCards.filter((card) => card.controller === player);
        return playerCards.filter((card) => super.canTarget(card, context));
    }

    hasReachedLimit(selectedCards, numPlayers) {
        return selectedCards.length >= numPlayers * this.numCardsPerPlayer;
    }

    rejectAllowed(context) {
        return this.ifAble && this.getMaximumSelectable(context) === 0;
    }
}

module.exports = EachPlayerCardSelector;
