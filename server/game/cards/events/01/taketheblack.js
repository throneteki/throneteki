const DrawCard = require('../../../drawcard.js');

class TakeTheBlack extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(this.game.currentPhase !== 'dominance') {
            return false;
        }

        return true;
    }

    play(player) {
        if(!this.canPlay(player, this)) {
            return;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => this.cardCondition(card),
            onSelect: (player, card) => this.onCardClicked(player, card)
        });
    }

    cardCondition(card) {
        if(card.getType() !== 'character' || !card.isUnique() || card.getCost() > 6) {
            return false;
        }

        return true;
    }

    onCardClicked(player, card) {
    }
}

TakeTheBlack.code = '01139';

module.exports = TakeTheBlack;
