const DrawCard = require('../../drawcard.js');

class Muster extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck for Knight',
            phase: 'marshal',
            cost: ability.costs.kneel(card => card.hasTrait('Knight') && card.getType() === 'character'),
            handler: context => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('Knight'),
                    onSelect: (player, card) => this.cardSelected(player, card, context.costs.kneel),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, kneelCard) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} and kneels {2} to search their deck and add {2} to their hand',
            player, this, card, kneelCard);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any card to their hand',
            player, this);
    }
}

Muster.code = '00019';

module.exports = Muster;
