const DrawCard = require('../../drawcard.js');

class BastardsBoys extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay(card => card.hasTrait('Commander')),
            match: this,
            effect: ability.effects.addIcon('power')
        });

        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay(card => card.hasTrait('The Riverlands')),
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });
    }
}

BastardsBoys.code = '21017';

module.exports = BastardsBoys;
