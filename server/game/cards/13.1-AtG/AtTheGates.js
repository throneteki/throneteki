const PlotCard = require('../../plotcard.js');

class AtTheGates extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getPrintedCost() <= 1 && card.isLimited(),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    hasUsedCityPlot() {
        return this.game.allCards.some(card => (
            card.controller === this.controller &&
            card.location === 'revealed plots' &&
            card.hasTrait('City')
        ));
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');

        if(this.hasUsedCityPlot()) {
            this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
                player, this, card);
            return;           
        }

        this.selectedCard = card;

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
        if(!this.selectedCard) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
            player, this, this.selectedCard);
        this.selectedCard = null;

        return true;
    }

    putInPlay(player) {
        if(!this.selectedCard) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play',
            player, this, this.selectedCard);
        player.putIntoPlay(this.selectedCard);
        this.selectedCard = null;

        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not retrieve any card',
            player, this);
    }
}

AtTheGates.code = '13020';

module.exports = AtTheGates;
