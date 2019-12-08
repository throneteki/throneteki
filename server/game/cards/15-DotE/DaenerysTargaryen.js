const DrawCard = require('../../drawcard.js');

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck',
            limit: ability.limit.perRound(1),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getType() === 'attachment' || card.hasTrait('Dragon'),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');

        if(card.getPrintedCost() > 3 || !this.controller.canPutIntoPlay(card)) {
            this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
                player, this, card);
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

    keepInHand(player) {
        if(!this.revealedCard) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
            player, this, this.revealedCard);
        this.revealedCard = null;

        return true;
    }

    putInPlay(player) {
        if(!this.revealedCard) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play',
            player, this, this.revealedCard);
        player.putIntoPlay(this.revealedCard);
        this.revealedCard = null;

        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any card to their hand',
            player, this);
    }
}

DaenerysTargaryen.code = '15001';

module.exports = DaenerysTargaryen;
