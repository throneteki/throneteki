const BaseCardSelector = require('./BaseCardSelector.js');

class EachPlayerCardSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);
        this.numCardsPerPlayer = properties.numCards;
    }

    canTarget(card, context, selectedCards) {
        return super.canTarget(card, context, selectedCards || []) && !this.isPlayerSatisfied(card, selectedCards || []);
    }

    isPlayerSatisfied(card, selectedCards) {
        let count = selectedCards.filter(selectedCard => selectedCard.controller === card.controller).length;
        return count >= this.numCardsPerPlayer;
    }

    defaultActivePromptTitle() {
        return this.numCardsPerPlayer === 1 ? 'Select a character controlled by each player' :
            `Select ${this.numCardsPerPlayer} characters controlled by each player`;
    }

    hasEnoughSelected(selectedCards, numPlayers, context) {
        return selectedCards.length === 0 && this.optional 
            || selectedCards.length === (numPlayers * this.numCardsPerPlayer)
            || this.ifAble && selectedCards.length === (this.getSelectablePlayers(context).length * this.numCardsPerPlayer);
    }

    hasEnoughTargets(context) {
        let numPlayers = context.game.getPlayers();
        let selectablePlayers = this.getSelectablePlayers(context);
        return this.optional || selectablePlayers.length === numPlayers || this.ifAble && selectablePlayers.length > 0;
    }

    getSelectablePlayers(context) {
        return context.game.getPlayers().filter(player => {
            let playerCards = context.game.allCards.filter(card => card.controller === player);
            let matchingCards = playerCards.filter(card => super.canTarget(card, context));
            return matchingCards.length >= this.numCardsPerPlayer;
        });
    }

    hasReachedLimit(selectedCards, numPlayers) {
        return selectedCards.length >= (numPlayers * this.numCardsPerPlayer);
    }

    canStartSelection(context, choosingPlayers) {
        let validChoosingPlayers = choosingPlayers.filter(choosingPlayer => {
            context.choosingPlayer = choosingPlayer;
            return this.hasEnoughTargets(context);
        });
        return choosingPlayers.length > 0 && validChoosingPlayers.length === choosingPlayers.length 
            || this.ifAble && validChoosingPlayers.length > 0;
    }
    rejectAllowed(context) {
        return this.ifAble && this.getSelectablePlayers(context).length === 0
    }
}

module.exports = EachPlayerCardSelector;
