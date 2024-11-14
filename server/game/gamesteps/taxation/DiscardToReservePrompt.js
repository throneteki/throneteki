import BaseStep from '../basestep.js';

class DiscardToReservePrompt extends BaseStep {
    constructor(game, source) {
        super(game);
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
        this.source = source;
    }

    continue() {
        while (this.remainingPlayers.length !== 0) {
            let currentPlayer = this.remainingPlayers.shift();

            if (currentPlayer.isBelowReserve()) {
                this.game.addMessage('{0} is already below their reserve value', currentPlayer);
            } else {
                this.promptPlayerToDiscard(currentPlayer);
                return false;
            }
        }

        this.game.raiseEvent('onReserveChecked');
    }

    promptPlayerToDiscard(currentPlayer) {
        let overReserve = currentPlayer.hand.length - currentPlayer.getReserve();
        this.game.promptForSelect(currentPlayer, {
            ordered: true,
            mode: 'exactly',
            numCards: overReserve,
            activePromptTitle:
                'Select ' + overReserve + ' cards to discard down to reserve (top first)',
            waitingPromptTitle: 'Waiting for opponent to discard down to reserve',
            cardCondition: (card) => card.location === 'hand' && card.controller === currentPlayer,
            onSelect: (player, cards) => this.discardCards(player, cards),
            onCancel: (player) => this.cancelSelection(player),
            source: this.source
        });
    }

    discardCards(player, cards) {
        // Reverse the order selection so that the first card selected ends up
        // on the top of the discard pile.
        cards = cards.reverse();
        player.discardCards(
            cards,
            false,
            () => {
                this.game.addMessage('{0} discards {1} to meet reserve', player, cards);
            },
            { source: 'reserve' }
        );
        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} continues without meeting reserve', player, this);

        return true;
    }
}

export default DiscardToReservePrompt;
