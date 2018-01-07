const _ = require('underscore');

const BaseStep = require('../basestep.js');

class DiscardToReservePrompt extends BaseStep {
    constructor(game) {
        super(game);
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
    }

    continue() {
        this.remainingPlayers = _.reject(this.remainingPlayers, player => player.isBelowReserve());

        if(_.isEmpty(this.remainingPlayers)) {
            return true;
        }

        this.promptPlayerToDiscard(this.remainingPlayers[0]);

        return false;
    }

    promptPlayerToDiscard(currentPlayer) {
        let overReserve = currentPlayer.hand.size() - currentPlayer.getTotalReserve();
        this.game.promptForSelect(currentPlayer, {
            ordered: true,
            mode: 'exactly',
            numCards: overReserve,
            activePromptTitle: 'Select ' + overReserve + ' cards to discard down to reserve (top first)',
            waitingPromptTitle: 'Waiting for opponent to discard down to reserve',
            cardCondition: card => card.location === 'hand' && card.controller === currentPlayer,
            onSelect: (player, cards) => this.discardCards(player, cards)
        });
    }

    discardCards(player, cards) {
        // Reverse the order selection so that the first card selected ends up
        // on the top of the discard pile.
        cards = cards.reverse();
        player.discardCards(cards, false, () => {
            this.game.addMessage('{0} discards {1} to meet reserve', player, cards);
            if(player.isBelowReserve()) {
                this.remainingPlayers = this.remainingPlayers.slice(1);
            }
        });
        return true;
    }
}

module.exports = DiscardToReservePrompt;
