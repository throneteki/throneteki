const DrawCard = require('../../drawcard.js');

class TheCitadel extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for Maesters',
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    cardCondition: card => card.getType() === 'character' && card.hasTrait('Maester'),
                    onSelect: (player, card) => this.selectCard(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    selectCard(player, card) {
        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand', player, this, card);
        player.moveCard(card, 'hand');
        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not retrieve any cards', player, this);
        return true;
    }
}

TheCitadel.code = '09042';

module.exports = TheCitadel;
