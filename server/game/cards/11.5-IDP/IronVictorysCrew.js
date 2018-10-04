const DrawCard = require('../../drawcard');

class IronVictorysCrew extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('Warship') && card.getType() === 'location',
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        if(card.name === 'Iron Victory') {
            this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', player, this, card);
            player.putIntoPlay(card);
        } else {
            this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand', player, this, card);
            player.moveCard(card, 'hand');
        }

    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add a card to their hand', player, this);
    }
}

IronVictorysCrew.code = '11091';

module.exports = IronVictorysCrew;
