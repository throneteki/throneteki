const DrawCard = require('../../drawcard.js');

class TheBlueBard extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeftPlay: event => event.card === this
            },
            message: '{player} uses {source} to search the top 10 cards of their deck for any number of Song events',
            handler: () => {
                this.selectedCards = [];
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    numToSelect: 10,
                    activePromptTitle: 'Select any number of events',
                    cardCondition: card => card.hasTrait('Song') && card.getType() === 'event',
                    onSelect: (player, cards, valids) => this.selectCards(player, cards, valids),
                    onCancel: player => this.cancelSelecting(player),
                    source: this
                });
            }
        });
    }

    selectCards(player, cards, valids) {
        if(valids.length > 0) {
            this.game.addMessage('{0} adds {1} to their hand', player, valids);
            for(let card of valids) {
                player.moveCard(card, 'hand');
            }
        }
    }

    cancelSelecting(player) {
        this.game.addMessage('{0} does not add any cards to their hand', player);
    }
}

TheBlueBard.code = '09010';

module.exports = TheBlueBard;
