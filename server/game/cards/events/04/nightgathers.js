const DrawCard = require('../../../drawcard.js');

class NightGathers extends DrawCard {
    canPlay(player, card) {
        if(this !== card || player.phase !== 'marshal') {
            return false;
        }

        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return true;
        }

        if(otherPlayer.getTotalReserve() >= player.getTotalReserve()) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Marshal cards from hand or opponent discard',
            waitingPromptTitle: 'Waiting for opponent to finish marshalling',
            cardCondition: card => card.getType() === 'character' && card.controller !== this.controller &&
                //You cannot marshal a unique card from your opponent's discard pile
                //if another copy of that card is in play
                player.canPlayCard(card, true) &&                             //in your dead pile
                (card.isUnique() ?
                    (!player.getDuplicateInPlay(card) &&                      //under your control
                    !card.owner.getDuplicateInPlay(card) &&                   //under his control
                    !card.owner.isCardNameInList(card.owner.deadPile, card))  //in his dead pile
                    : true),
            onSelect: (player, card) => this.onCardSelected(player, card),
            onCancel: (player) => this.doneMarshalling(player)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.game.takeControl(player, card);
        var cost = player.getCostForCard(card, true);
        player.gold -= cost;
        this.game.addMessage('{0} marshals {1} from {2}\'s discard pile costing {3}', player, card, card.owner, cost);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Marshal cards from hand or opponent discard',
            waitingPromptTitle: 'Waiting for opponent to finish marshalling',
            cardCondition: card => card.getType() === 'character' && card.controller !== this.controller &&
            player.canPlayCard(card, true) &&                             //in your dead pile
            (card.isUnique() ?
                (!player.getDuplicateInPlay(card) &&                      //under your control
                !card.owner.getDuplicateInPlay(card) &&                   //under his control
                !card.owner.isCardNameInList(card.owner.deadPile, card))  //in his dead pile
                : true),
            onSelect: (player, card) => this.onCardSelected(player, card),
            onCancel: (player) => this.doneMarshalling(player)
        });

        return true;
    }

    doneMarshalling() {
        return true;
    }
}

NightGathers.code = '04046';

module.exports = NightGathers;
