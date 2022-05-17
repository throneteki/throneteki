const PlotCard = require('../../plotcard.js');

class ATimeForWolves extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to search their deck for a Direwolf card',
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('Direwolf'),
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, valid) {
        if(valid) {
            player.moveCard(card, 'hand');
    
            if(card.getPrintedCost() > 3 || !player.canPutIntoPlay(card)) {
                this.game.addMessage('{0} adds {1} to their hand',
                    player, card);
                return;
            }
    
            this.revealedCard = card;
    
            let buttons = [
                { text: 'Keep in hand', method: 'keepInHand' },
                { text: 'Put in play', method: 'putInPlay' }
            ];
    
            this.game.promptWithMenu(player, this, {
                activePrompt: {
                    menuTitle: 'Put card into play?',
                    buttons: buttons
                },
    
                source: this
            });
        }
    }

    keepInHand(player) {
        if(!this.revealedCard) {
            return false;
        }

        this.game.addMessage('{0} adds {1} to their hand',
            player, this.revealedCard);
        this.revealedCard = null;

        return true;
    }

    putInPlay(player) {
        if(!this.revealedCard) {
            return false;
        }

        this.game.addMessage('{0} puts {1} into play',
            player, this.revealedCard);
        player.putIntoPlay(this.revealedCard);
        this.revealedCard = null;

        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not retrieve any card',
            player, this);
    }
}

ATimeForWolves.code = '03046';

module.exports = ATimeForWolves;
