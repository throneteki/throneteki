const DrawCard = require('../../drawcard.js');

class BoniferTheGood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                !card.isFaction('neutral') &&
                card.hasTrait('The Seven') &&
                card.getType() === 'character',
            effect: ability.effects.addKeyword('insight')
        });
    }
}

BoniferTheGood.code = '18001';

module.exports = BoniferTheGood;
