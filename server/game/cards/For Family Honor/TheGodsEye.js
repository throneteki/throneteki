const DrawCard = require('../../../drawcard.js');

class TheGodsEye extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeDiscarded()
        });

        this.plotModifiers({
            reserve: 1,
            gold: 1
        });
    }
}

TheGodsEye.code = '04058';

module.exports = TheGodsEye;
