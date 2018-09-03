const DrawCard = require('../../drawcard.js');

class TheBlueBard extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeftPlay: event => event.card === this
            },
            handler: () => {
                this.selectedCards = [];
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    numToSelect: 10,
                    activePromptTitle: 'Select any number of events',
                    cardCondition: card => card.hasTrait('Song') && card.getType() === 'event',
                    onSelect: (player, cards) => this.selectCards(player, cards),
                    onCancel: player => this.cancelSelecting(player),
                    source: this
                });
            }
        });
    }

    selectCards(player, cards) {
        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand', player, this, cards);
        for(let card of cards) {
            player.moveCard(card, 'hand');
        }
    }

    cancelSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not retrieve any cards', player, this);
    }
}

TheBlueBard.code = '09010';

module.exports = TheBlueBard;
