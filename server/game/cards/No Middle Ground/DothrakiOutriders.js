const DrawCard = require('../../../drawcard.js');

class DothrakiOutriders extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('marshal', () => this.getNumberOfDothraki())
        });
    }

    getNumberOfDothraki() {
        return this.controller.getNumberOfCardsInPlay(card => card.hasTrait('Dothraki') && card.getType() === 'character');
    }
}

DothrakiOutriders.code = '02074';

module.exports = DothrakiOutriders;
