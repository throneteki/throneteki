const DrawCard = require('../../drawcard.js');

class TheCitadel extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for Maesters',
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {costs.kneel} to search the top 10 cards of their deck for a Maester character',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    cardCondition: card => card.getType() === 'character' && card.hasTrait('Maester'),
                    onSelect: (player, card, valid) => this.selectCard(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    selectCard(player, card, valid) {
        if(valid) {
            this.game.addMessage('{0} adds {1} to their hand', player, card);
            player.moveCard(card, 'hand');
        }
        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand', player);
        return true;
    }
}

TheCitadel.code = '09042';

module.exports = TheCitadel;
