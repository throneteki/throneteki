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
                    onSelect: (player, card) => this.selectCard(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    selectCard(player, card) {
        this.selectedCards.push(card);
        player.removeCardFromPile(card);
        return true;
    }

    doneSelecting(player) {
        if(this.selectedCards.length === 0) {
            this.game.addMessage('{0} uses {1} to search their deck, but does not retrieve any cards', player, this);

            return true;
        }

        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand', player, this, this.selectedCards);
        for(let card of this.selectedCards) {
            player.moveCard(card, 'hand');
        }

        return true;
    }
}

TheBlueBard.code = '09010';

module.exports = TheBlueBard;
