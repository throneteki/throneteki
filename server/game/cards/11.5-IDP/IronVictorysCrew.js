const DrawCard = require('../../drawcard');

class IronVictorysCrew extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            message: '{player} uses {source} to search their deck for a Warship location',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('Warship') && card.getType() === 'location',
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, valid) {
        if(valid) {
            if(card.name === 'Iron Victory') {
                this.game.addMessage('{0} puts {1} into play', player, card);
                player.putIntoPlay(card);
            } else {
                this.game.addMessage('{0} adds {1} to their hand', player, card);
                player.moveCard(card, 'hand');
            }
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add a card to their hand', player);
    }
}

IronVictorysCrew.code = '11091';

module.exports = IronVictorysCrew;
