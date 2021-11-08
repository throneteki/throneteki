const DrawCard = require('../../drawcard.js');

class JacelynBywater extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.canAmbush(card =>
                card.controller === this.controller &&
                card.location === 'discard pile' &&
                card.getType() === 'character' &&
                card.isFaction('lannister') &&
                !card.isUnique())
        });
    }
}

JacelynBywater.code = '21008';

module.exports = JacelynBywater;
