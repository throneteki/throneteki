const DrawCard = require('../../drawcard.js');

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck',
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to search the top 10 cards of their deck for an attachment or Dragon card',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getType() === 'attachment' || card.hasTrait('Dragon'),
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
    
            if(card.getPrintedCost() > 3 || !this.controller.canPutIntoPlay(card)) {
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
        this.game.addMessage('{0} does not add any card to their hand',
            player, this);
    }
}

DaenerysTargaryen.code = '15001';

module.exports = DaenerysTargaryen;
