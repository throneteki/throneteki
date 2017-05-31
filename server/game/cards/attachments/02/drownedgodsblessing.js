const DrawCard = require('../../../drawcard.js');

class DrownedGodsBlessing extends DrawCard {
    // TODO: Cannot be chosen as the only target of opponent events
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('Drowned God')
        });
        this.plotModifiers({
            initiative: 1
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

DrownedGodsBlessing.code = '02112';

module.exports = DrownedGodsBlessing;
