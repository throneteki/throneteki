const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class Confiscation extends PlotCard {
    revealed(player) {
        if(this.owner !== player) {
            return true;
        }

        if(player.cardsInPlay.any(card => {
            return card.attachments.length !== 0;
        })) {
            return true;
        }

        player.menuTitle = 'Select attachment to discard';
        player.buttons = [{ text: 'Done', command: 'plot', method: 'cancelDiscard' }];

        player.selectCard = true;

        this.game.promptForSelect(player, this.onCardSelected);

        return false;
    }

    cancelDiscard(player) {
        if(!this.inPlay || this.owner !== player) {
            return;
        }

        this.game.playerRevealDone(player);
    }

    onCardSelected(player, cardId) {
        if(!this.inPlay || this.owner !== player) {
            return;
        }

        var attachment = player.findCardInPlayByUuid(cardId);

        if(!attachment) {
            var otherPlayer = this.game.findOtherPlayer(player);

            if(!otherPlayer) {
                this.game.revealDone(player);
                return;            
            }

            attachment = otherPlayer.findCardInPlayByUuid(cardId);
        }
        
        
        if(!attachment || !attachment.getType() !== 'attachment') {
            this.game.revealDone(player);
            return;
        }

        attachment.owner.discardCard(attachment);

        this.game.addMessage('{0} uses {1} to discard {2}', attachment.owner, this, attachment);
        this.game.revealDone(player);
    }
}

Confiscation.code = '01009';

module.exports = Confiscation;
