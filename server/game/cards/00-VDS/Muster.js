const DrawCard = require('../../drawcard.js');

class Muster extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck for Knight',
            phase: 'marshal',
            cost: ability.costs.kneel(card => card.hasTrait('Knight') && card.getType() === 'character'),
            message: '{player} plays {source} and kneels {costs.kneel} to search their deck for a Knight character',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.hasTrait('Knight'),
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
            this.game.addMessage('{0} adds {1} to their hand',
                player, card);
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand',
            player);
    }
}

Muster.code = '00019';

module.exports = Muster;
